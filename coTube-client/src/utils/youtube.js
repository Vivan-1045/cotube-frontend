export function extractVideoId(url) {

    if (!url) return null;

    const regex =
        /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/;

    const match = url.match(regex);

    return match ? match[1] : null;
}