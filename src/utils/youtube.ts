/**
 * YouTubeのIDが有効かどうかをoEmbed APIを使ってチェックする
 * @param id チェックしたいYouTube動画のID
 * @returns 有効であれば true, 無効であれば false
 */
export const isValidYouTubeUrl = async (url: URL): Promise<boolean> => {
  const id = url.searchParams.get("v");
  // oEmbed APIのエンドポイントURL
  const checkUrl = `/youtube-api/oembed?url=http://www.youtube.com/watch?v=${id}&format=json`;

  try {
    const response = await fetch(checkUrl);
    return response.ok;
  } catch (error) {
    // ネットワークエラーなど、リクエスト自体に失敗した場合
    console.error("Validation check failed:", error);
    return false;
  }
};
