export const searchMusic = async (query) => {
  const limit = 200;

  const response = await fetch(
    `https://itunes.apple.com/search?term=${encodeURIComponent(
      query,
    )}&entity=song&limit=${limit}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch songs");
  }

  const data = await response.json();

  return data.results || [];
};
