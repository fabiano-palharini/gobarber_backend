interface IMailConfig {
  driver: 'ethereal' | 'ses';

  defaults: {
    from: {
      email: string;
      name: string;
    }
  }
}


export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: 'must_be_an_email_with_a_valid_domain@zxc.com',
      name: 'My Name'
    }
  }
} as IMailConfig;
