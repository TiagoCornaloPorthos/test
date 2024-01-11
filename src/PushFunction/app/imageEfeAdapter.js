
module.exports = function imageEfeAdapter(content) {
  const file = content.objects[0].files ? content.objects[0].files[0] : content.objects[1].files[0]
  const title = content.packageInfo.format.description === "Foto" ? content.objects[0].title : content.packageInfo.title
  const text = content.packageInfo.format.description === "Foto" ? content.objects[0].text : content.packageInfo.text


  const img = {
    additional_properties: {
      mime_type: file.mimeType,
      originalName: file.fileName,
      originalUrl: file.url,
      owner: 'EFE',
      published: true
    },
    height: file.height,
    image_type: 'photograph',
    owner: { id: 'artear', sponsored: false },
    subtitle: title,
    type: 'image',
    width: file.width,
    caption: text,
    credits: { affiliation: [{name: 'EFE Servicios'}], by: [{name: content.packageInfo.metaData.authors[0] ? content.packageInfo.metaData.authors[0].split('/')[0] : 'EFE'}]},
    distributor: {category:'wires', mode: "custom", name:'EFE Servicios'},
    version: '0.10.6'
  }
  return img
}
