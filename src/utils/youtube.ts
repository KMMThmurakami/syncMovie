/**
 * YouTubeのIDが有効かどうかをoEmbed APIを使ってチェックする
 * @param id チェックしたいYouTube動画のID
 * @returns 有効であれば true, 無効であれば false
 */
export const isValidYouTubeId = async (id: string): Promise<boolean> => {
  // oEmbed APIのエンドポイントURL
  const url = `/youtube-api/oembed?url=http://www.youtube.com/watch?v=${id}&format=json`;

  try {
    const response = await fetch(url);
    return response.ok;
  } catch (error) {
    // ネットワークエラーなど、リクエスト自体に失敗した場合
    console.error("Validation check failed:", error);
    return false;
  }
};
