const frontLink = (): string => process.env.FRONT_HOST || 'https://web-cv.web.app';
const serverHost = (): string => process.env.SERVER_HOST || 'https://web-cv.web.app';

export const messages = {
  EN: {
    'visit subject': 'Someone viewed your page',
    'visit text': (name, country, city, ip): string =>
      `<p>Hi, ${name}!</p><br>` +
      `<p>Someone visited your page at web-cv from ${country || 'undefined country'}.</p>` +
      `<p>Ip address is ${ip.length > 5 ? ip : 'unknown'}. Possible city: ${city || 'not established'}\n</p><br>` +
      `<p>See all visits <a href='${frontLink()}/me/visits'>here</a></p>` +
      `<p><a href='${frontLink()}/me/unsubscribe'>unsubscribe</a> notifications.</p>`,
    'verification subject': 'Verify your email address',
    'verification text': (name, token): string => 
      `<p>Hi, ${name}!\n</p><br>` +
      `<p>Click <a style='font-weight: bold' href='${serverHost()}/profiles/${token}/verify'>here</a> to ` +
      'finish your registration.</p>',
    'feedback subject': (name): string => `${name} send you message`,
    'feedback text': (owner, contact, text): string =>
      `<p>Hi, ${owner}!\n</p><br>` +
      `<p>You have new message from your <a href='${frontLink()}/me'>web-cv profile</a>:</p><br>` +
      `<p>${text.replace('\n', '<br>')}</p>` +
      `<p>Conact: ${contact}</p>`
  },
  RU: {
    'visit subject': 'Кто-то просмотрел вашу страницу',
    'visit text': (name, country, city, ip): string =>
      `<p>Привет, ${name}!</p><br>` +
      `<p>Кто-то посетил вашу страницу web-cv из ${country || 'не установленой страны'}.</p>` +
      `<p>Ip адрес: ${ip.length > 5 ? ip : 'не определен'}. Предполагаемый город: ${city || 'не установлен'}</p><br>` +
      `<p>Посмотреть все просмотры <a href='${frontLink()}/me/visits'>здесь</a></p>` +
      `<p><a href='${frontLink()}/me/unsubscribe'>отписаться</a> от уведомлений.</p>`,
    'verification subject': 'Подтвердите свой адрес электронной почты',
    'verification text': (name, token): string =>
      `<p>Здравствуйте, ${name}!</p><br>` +
      `<p>Нажмите <a style='font-weight: bold' href='${serverHost()}/profiles/${token}/verify'>сюда</a> чтобы ` +
      'завершить регистрацию.</p>',
    'feedback subject': (name): string => `${name} отправил вам ссобщение`,
    'feedback text': (owner, contact, text): string =>
      `<p>Привет, ${owner}!\n</p><br>` +
      `<p>У вас новые сообщения из <a href='${frontLink()}/me'>профиля на web-cv</a>:</p><br>` +
      `<p>${text.replace('\n', '<br>')}</p>` +
      `<p>Котнакт: ${contact}</p>`
  }
};
