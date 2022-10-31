export default function(phoneNumber) {
  return `${phoneNumber.substring(1, 4)}-${phoneNumber.substring(
    4,
    7
  )}-${phoneNumber.substring(7, 11)}`;
}
