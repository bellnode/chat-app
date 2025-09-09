
const fileFormat = (url = "") => {
    const fileExt = url.split(".").pop();

    if (fileExt === 'mp4' | fileExt === 'webm' | fileExt === 'ogg')
        return 'video'

    if (fileExt === 'mp3' | fileExt === 'wav')
        return 'audio'

    if (fileExt === 'jpg' | fileExt === 'png' | fileExt === 'jpeg' | fileExt === 'gif')
        return 'image'

    return 'file'
}

const transformImage = (url = '', width = 200) => {
    const newURL = url.replace('upload/', `upload/dpr_auto/w_${width}/`)
    return newURL
}

export { fileFormat, transformImage }