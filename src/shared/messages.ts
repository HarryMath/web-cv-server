const frontLink = (): string => process.env.FRONT_HOST || 'https://web-cv.web.app';
const serverHost = (): string => process.env.SERVER_HOST || 'https://web-cv.web.app';

export const messages = {
  EN: {
    'visit subject': 'Someone viewed your page',
    'visit text': (name, country, city, ip): string =>
      `<p>Hi, ${name}!</p><br>` +
      `<p>Someone visited your page at web-cv from ${country}.</p>` +
      `<p>Ip address is ${ip}. Possible city: ${city}\n</p><br>` +
      `<p>See all visits <a href='${frontLink()}/me/visits'>here</a></p>` +
      `<p><a href='${frontLink()}/me/unsubscribe'>unsubscribe</a> notifications.</p>`,
    'verification subject': 'Verify your email address',
    'verification text': (name, token): string => 
      `<p>Hi, ${name}!\n</p><br>` +
      `<p>Click <a style='font-weight: bold' href='${serverHost()}/profiles/${token}/verify'>here</a> to ` +
      'finish your registration.</p>'
  },
  RU: {
    'visit subject': 'Кто-то просмотрел вашу страницу',
    'visit text': (name, country, city, ip): string =>
      `<p>Привет, ${name}!</p><br>` +
      `<p>Кто-то посетил вашу страницу web-cv из ${country}.</p>` +
      `<p>Ip адрес: ${ip}. Предполагаемый город: ${city}</p><br>` +
      `<p>Посмотреть все просмотры <a href='${frontLink()}/me/visits'>здесь</a></p>` +
      `<p><a href='${frontLink()}/me/unsubscribe'>отписаться</a> от уведомлений.</p>`,
    'verification subject': 'Подтвердите свой адрес электронной почты',
    'verification text': (name, token): string =>
      `<p>Здравствуйте, ${name}!</p><br>` +
      `<p>Нажмите <a style='font-weight: bold' href='${serverHost()}/profiles/${token}/verify'>сюда</a> чтобы ` +
      'завершить регистрацию.</p>'
  }
}
