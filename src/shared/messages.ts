const frontLink = (): string => process.env.FRONT_HOST || 'https://web-cv.web.app';
const serverHost = (): string => process.env.SERVER_HOST || 'https://web-cv.web.app';

export const messages = {
  EN: {
    'visit subject': 'Someone viewed your page',
    'visit text': (name, country, city, ip): string =>
      `Hi, ${name}!\n` +
      `Someone visited your page at web-cv from ${country}.\n` +
      `Ip address is ${ip}. Possible city: ${city}\n` +
      `See all visits <a href='${frontLink()}/me/visits'>here</a>\n` +
      `<a href='${frontLink()}/me/unsubscribe'>unsubscribe</a> notifications.`,
    'verification subject': 'Verify your email address',
    'verification text': (name, token): string => 
      `Hi, ${name}!\n` +
      `Click <a href='${serverHost()}/profiles/${token}/verify'>here</a> to ` +
      'finish your registration.'
  },
  RU: {
    'visit subject': 'Кто-то просмотрел вашу страницу',
    'visit text': (name, country, city, ip): string =>
      `Привет, ${name}!\n` +
      `Кто-то посетил вашу страницу web-cv из ${country}.\n` +
      `Ip адрес: ${ip}. Предполагаемый город: ${city}\n` +
      `Посмотреть все просмотры <a href='${frontLink()}/me/visits'>здесь</a>\n` +
      `<a href='${frontLink()}/me/unsubscribe'>отписаться</a> от уведомлений.`,
    'verification subject': 'Подтвердите свой адрес электронной почты',
    'verification text': (name, token): string =>
      `Здравствуйте, ${name}!\n` +
      `Нажмите <a href='${serverHost()}/profiles/${token}/verify'>сюда</a> чтобы ` +
      'завершить регистрацию.'
  }
}
