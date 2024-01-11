#!/usr/bin/make -f

SHELL = /bin/sh

SAMCONFIG_PATH = samconfig.toml
PARAMETER_OVERRIDES_PATH = resources/parameter_overrides

define samconfig
$(wildcard ${SAMCONFIG_PATH})
endef

stack-deploy: validate build
ifeq (${samconfig},)
	$(info ${SAMCONFIG_PATH} not found! Deploying for the first time)
	@sam deploy --guided
endif
	$(info Deploying stack)
	@sam deploy --parameter-overrides $(PARAMETER_OVERRIDES)

build:
	@sam build

validate:
	$(info Validating SAM template)
	@sam validate

start-lambda: clean
	$(info Setting up local Lambda Service)
	@sam build LibLayer
	@sam local start-lambda --parameter-overrides ${PARAMETER_OVERRIDES} --env-vars env.json

queue-url:
	@aws --region ${region} cloudformation describe-stacks --stack-name ${stackname} --query 'Stacks[0].Outputs[?OutputKey==`SqsQueueUrl`].OutputValue' --output text

tokens-table-name:
	@aws --region ${region} cloudformation describe-stacks --stack-name ${stackname} --query 'Stacks[0].Outputs[?OutputKey==`TokensTableName`].OutputValue' --output text

stack-delete:
	$(info Deleting AWS Stack ${stackname})
	@aws --region ${region} cloudformation delete-stack --stack-name ${stackname}
	$(info done)

clean:
	$(info Deleting SAM build artifacts)
	@rm -rf .aws-sam

define PARAMETER_OVERRIDES
$(if $(wildcard ${PARAMETER_OVERRIDES_PATH}), \
	$(shell cat ${PARAMETER_OVERRIDES_PATH}), \
	$(error Parameter overrides file not found at '${PARAMETER_OVERRIDES_PATH}') \
)
endef

define stackname
$(call get_config_value,stack_name)
endef

define region
$(call get_config_value,region)
endef

define get_config_value
$(if ${samconfig}, \
	$(shell awk '/$(1)/{gsub(/"/, "", $$3); print $$3}' ${SAMCONFIG_PATH}), \
	$(error $(1) is not defined. Run 'make stack-deploy' to have your stack deployed and configuration set) \
)
endef

.PHONY: \
	start-lambda \
	stack-deploy \
	stack-delete \
	build \
	validate \
	queue-url \
	clean

.DEFAULT_GOAL := stack-deploy
