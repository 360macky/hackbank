export default function (currency) {
  switch (currency) {
    case 'PEN':
      return 'S/';
    case 'USD':
      return '$';
    default:
      break;
  }
}
