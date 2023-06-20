import { useI18n } from 'vue-i18n'

function isValidEmail (val) {
    const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
    return emailPattern.test(val);
}

export default function () {
  const { t } = useI18n()
  const textRules = [val => !!val || t('mandatory_field'), val => val.length > 4 || t('weak_password')]
  const emailRules = [val => !!val || t('missing_email'), isValidEmail]

  return {
    textRules,
    emailRules
  }
}
