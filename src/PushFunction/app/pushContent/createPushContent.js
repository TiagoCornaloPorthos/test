const { MissingDependencyError } = require('../errors');
const imageARCAdapter = require('../imageARCAdapter');

module.exports = function(wireEfeAdapter, wireAfpAdapter, imageEfeAdapter, imageARCAdapter, createPhotocenterImage, storyService) {
  if (wireEfeAdapter === undefined) {
    throw new MissingDependencyError(`'wireEfeAdapter' dependency should be provided. Got: ${wireEfeAdapter}`);
  }
  if (wireAfpAdapter === undefined) {
    throw new MissingDependencyError(`'wireEfeAdapter' dependency should be provided. Got: ${wireEfeAdapter}`);
  }
  if (storyService === undefined) {
    throw new MissingDependencyError(`'storyService' dependency should be provided. Got: ${storyService}`);
  }
  if (imageEfeAdapter === undefined) {
    throw new MissingDependencyError(`'imageEfeAdapter' dependency should be provided. Got: ${imageEfeAdapter}`);
  }
  if (imageARCAdapter === undefined) {
    throw new MissingDependencyError(`'imageARCAdapter' dependency should be provided. Got: ${imageARCAdapter}`);
  }
  if (createPhotocenterImage === undefined) {
    throw new MissingDependencyError(`'createPhotocenterImage' dependency should be provided. Got: ${createPhotocenterImage}`);
  }

  const getAnsFormattedContent = (content, image) => {
    if (content.source === 'efeservicios') {
      return wireEfeAdapter(JSON.parse(content.data), image)
    }
    if (content.source === 'afp') {
      return wireAfpAdapter(JSON.parse(content.data))
    }
  }

  const pushMultimediaStory = async (content) => {
    const image = await pushImage(content)
    const ARCAdaptedImage = await imageARCAdapter(image)
    return await pushStory(content, ARCAdaptedImage)
  }

  const pushStory = async (content, image = {}) => {
    const ansFormattedContent = getAnsFormattedContent(content, image);
    const subsection = content.source === 'efeservicios' ? 'efe' : content.source
    const sections = {deep: '/agencias/' + subsection, shallow: '/agencias'}
    const document = await storyService.create(ansFormattedContent);
    await storyService.circulate(document.id, sections);
    const result = { ...document };
    if (content.publish) {
      const { ans: { publish_date } } = await storyService.publish(document.id);
      result.publish_date = publish_date;
    }
    return await result;
  }

  const pushImage = async (content) => {
    const formattedImage = imageEfeAdapter(JSON.parse(content.data))
    return await createPhotocenterImage(formattedImage)
  }

  return async function(content) {

    const { packageInfo : { format : { description } } } = JSON.parse(content.data)
    const actions = {'Foto': pushImage, 'Texto': pushStory, "Multimedia" : pushMultimediaStory}
    const action = content.source === 'efeservicios' ? actions[description] : actions['Texto']

    return await action(content)

  };
};
