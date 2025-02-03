export const getRole = () => {
  const cookies = document.cookie.split('; ');
  const cookie = cookies.find(row => row.startsWith('role='));

  if (!cookie) {
    return null;
  }

  return cookie.split('=')[1];
};