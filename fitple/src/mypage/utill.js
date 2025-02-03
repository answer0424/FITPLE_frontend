export const getRole = () => {
  const cookies = document.cookie.split('; ');
  console.log("꾸끼들" + cookies);
  const cookie = cookies.find(row => row.startsWith('role='));
  console.log("권한 꾸끼" + cookie);

  if (!cookie) {
    return null;
  }

  return cookie.split('=')[1];
};