import type { SupportedLocale } from '@/i18n/config';

export type MessageKey =
  | 'layout.skipToMain'
  | 'language.label'
  | 'header.quick.calculators'
  | 'header.quick.blog'
  | 'header.quick.learn'
  | 'header.quick.saved'
  | 'header.quickLinksAria'
  | 'header.mobileNavAria'
  | 'header.openMenu'
  | 'header.closeMenu'
  | 'footer.tagline'
  | 'footer.section.calculators'
  | 'footer.section.company'
  | 'footer.section.legal'
  | 'footer.calc.bmi'
  | 'footer.calc.bodyFat'
  | 'footer.calc.calorieDeficit'
  | 'footer.calc.tdee'
  | 'footer.company.about'
  | 'footer.company.editorial'
  | 'footer.company.contact'
  | 'footer.company.blog'
  | 'footer.legal.privacy'
  | 'footer.legal.terms'
  | 'footer.legal.disclaimer'
  | 'footer.legal.cookies'
  | 'footer.trust.reviewed'
  | 'footer.trust.learnProcess'
  | 'footer.medicalDisclaimer'
  | 'footer.rightsReserved';

const MESSAGES: Record<SupportedLocale, Record<MessageKey, string>> = {
  en: {
    'layout.skipToMain': 'Skip to main content',
    'language.label': 'Language',
    'header.quick.calculators': 'Calculators',
    'header.quick.blog': 'Blog',
    'header.quick.learn': 'Learn',
    'header.quick.saved': 'Saved',
    'header.quickLinksAria': 'Primary quick links',
    'header.mobileNavAria': 'Mobile navigation',
    'header.openMenu': 'Open menu',
    'header.closeMenu': 'Close menu',
    'footer.tagline': 'Your go-to resource for health and fitness calculators',
    'footer.section.calculators': 'Calculators',
    'footer.section.company': 'Company',
    'footer.section.legal': 'Legal',
    'footer.calc.bmi': 'BMI Calculator',
    'footer.calc.bodyFat': 'Body Fat Calculator',
    'footer.calc.calorieDeficit': 'Calorie Deficit Calculator',
    'footer.calc.tdee': 'TDEE Calculator',
    'footer.company.about': 'About Us',
    'footer.company.editorial': 'Editorial Process',
    'footer.company.contact': 'Contact Us',
    'footer.company.blog': 'Blog',
    'footer.legal.privacy': 'Privacy Policy',
    'footer.legal.terms': 'Terms of Service',
    'footer.legal.disclaimer': 'Disclaimer',
    'footer.legal.cookies': 'Cookie Settings',
    'footer.trust.reviewed': 'Content reviewed by certified health and fitness professionals',
    'footer.trust.learnProcess': 'Learn about our process',
    'footer.medicalDisclaimer':
      'HealthCheck provides general informational content and tools only. Nothing on this website constitutes medical advice. Always consult a qualified healthcare professional before making changes to your diet, exercise, or health regimen.',
    'footer.rightsReserved': 'All rights reserved.',
  },
  es: {
    'layout.skipToMain': 'Saltar al contenido principal',
    'language.label': 'Idioma',
    'header.quick.calculators': 'Calculadoras',
    'header.quick.blog': 'Blog',
    'header.quick.learn': 'Aprender',
    'header.quick.saved': 'Guardado',
    'header.quickLinksAria': 'Enlaces rapidos principales',
    'header.mobileNavAria': 'Navegacion movil',
    'header.openMenu': 'Abrir menu',
    'header.closeMenu': 'Cerrar menu',
    'footer.tagline': 'Tu recurso de confianza para calculadoras de salud y fitness',
    'footer.section.calculators': 'Calculadoras',
    'footer.section.company': 'Empresa',
    'footer.section.legal': 'Legal',
    'footer.calc.bmi': 'Calculadora de IMC',
    'footer.calc.bodyFat': 'Calculadora de grasa corporal',
    'footer.calc.calorieDeficit': 'Calculadora de deficit calorico',
    'footer.calc.tdee': 'Calculadora de TDEE',
    'footer.company.about': 'Sobre nosotros',
    'footer.company.editorial': 'Proceso editorial',
    'footer.company.contact': 'Contactanos',
    'footer.company.blog': 'Blog',
    'footer.legal.privacy': 'Politica de privacidad',
    'footer.legal.terms': 'Terminos de servicio',
    'footer.legal.disclaimer': 'Descargo de responsabilidad',
    'footer.legal.cookies': 'Configuracion de cookies',
    'footer.trust.reviewed': 'Contenido revisado por profesionales certificados en salud y fitness',
    'footer.trust.learnProcess': 'Conoce nuestro proceso',
    'footer.medicalDisclaimer':
      'HealthCheck ofrece solo contenido y herramientas informativas generales. Nada en este sitio web constituye consejo medico. Consulta siempre a un profesional de la salud calificado antes de cambiar tu dieta, ejercicio o regimen de salud.',
    'footer.rightsReserved': 'Todos los derechos reservados.',
  },
  fr: {
    'layout.skipToMain': 'Aller au contenu principal',
    'language.label': 'Langue',
    'header.quick.calculators': 'Calculateurs',
    'header.quick.blog': 'Blog',
    'header.quick.learn': 'Apprendre',
    'header.quick.saved': 'Sauvegardes',
    'header.quickLinksAria': 'Liens rapides principaux',
    'header.mobileNavAria': 'Navigation mobile',
    'header.openMenu': 'Ouvrir le menu',
    'header.closeMenu': 'Fermer le menu',
    'footer.tagline': 'Votre reference pour les calculateurs sante et fitness',
    'footer.section.calculators': 'Calculateurs',
    'footer.section.company': 'Entreprise',
    'footer.section.legal': 'Mentions legales',
    'footer.calc.bmi': 'Calculateur IMC',
    'footer.calc.bodyFat': 'Calculateur de masse grasse',
    'footer.calc.calorieDeficit': 'Calculateur de deficit calorique',
    'footer.calc.tdee': 'Calculateur TDEE',
    'footer.company.about': 'A propos',
    'footer.company.editorial': 'Processus editorial',
    'footer.company.contact': 'Contact',
    'footer.company.blog': 'Blog',
    'footer.legal.privacy': 'Politique de confidentialite',
    'footer.legal.terms': "Conditions d'utilisation",
    'footer.legal.disclaimer': 'Avertissement',
    'footer.legal.cookies': 'Parametres des cookies',
    'footer.trust.reviewed':
      'Contenu verifie par des professionnels certifies de la sante et du fitness',
    'footer.trust.learnProcess': 'En savoir plus sur notre processus',
    'footer.medicalDisclaimer':
      "HealthCheck fournit uniquement du contenu et des outils d'information generale. Rien sur ce site ne constitue un avis medical. Consultez toujours un professionnel de sante qualifie avant de modifier votre alimentation, votre exercice ou votre regimen de sante.",
    'footer.rightsReserved': 'Tous droits reserves.',
  },
  de: {
    'layout.skipToMain': 'Zum Hauptinhalt springen',
    'language.label': 'Sprache',
    'header.quick.calculators': 'Rechner',
    'header.quick.blog': 'Blog',
    'header.quick.learn': 'Lernen',
    'header.quick.saved': 'Gespeichert',
    'header.quickLinksAria': 'Primaere Schnelllinks',
    'header.mobileNavAria': 'Mobile Navigation',
    'header.openMenu': 'Menue oeffnen',
    'header.closeMenu': 'Menue schliessen',
    'footer.tagline': 'Ihre Anlaufstelle fuer Gesundheits- und Fitnessrechner',
    'footer.section.calculators': 'Rechner',
    'footer.section.company': 'Unternehmen',
    'footer.section.legal': 'Rechtliches',
    'footer.calc.bmi': 'BMI-Rechner',
    'footer.calc.bodyFat': 'Koerperfett-Rechner',
    'footer.calc.calorieDeficit': 'Kaloriendefizit-Rechner',
    'footer.calc.tdee': 'TDEE-Rechner',
    'footer.company.about': 'Ueber uns',
    'footer.company.editorial': 'Redaktioneller Prozess',
    'footer.company.contact': 'Kontakt',
    'footer.company.blog': 'Blog',
    'footer.legal.privacy': 'Datenschutzrichtlinie',
    'footer.legal.terms': 'Nutzungsbedingungen',
    'footer.legal.disclaimer': 'Haftungsausschluss',
    'footer.legal.cookies': 'Cookie-Einstellungen',
    'footer.trust.reviewed':
      'Inhalte geprueft von zertifizierten Gesundheits- und Fitnessfachkraeften',
    'footer.trust.learnProcess': 'Mehr ueber unseren Prozess',
    'footer.medicalDisclaimer':
      'HealthCheck bietet nur allgemeine Informationsinhalte und Tools. Nichts auf dieser Website stellt medizinischen Rat dar. Konsultieren Sie immer qualifiziertes medizinisches Fachpersonal, bevor Sie Ihre Ernaehrung, Ihr Training oder Ihr Gesundheitsprogramm aendern.',
    'footer.rightsReserved': 'Alle Rechte vorbehalten.',
  },
  pt: {
    'layout.skipToMain': 'Pular para o conteudo principal',
    'language.label': 'Idioma',
    'header.quick.calculators': 'Calculadoras',
    'header.quick.blog': 'Blog',
    'header.quick.learn': 'Aprender',
    'header.quick.saved': 'Salvos',
    'header.quickLinksAria': 'Links rapidos principais',
    'header.mobileNavAria': 'Navegacao mobile',
    'header.openMenu': 'Abrir menu',
    'header.closeMenu': 'Fechar menu',
    'footer.tagline': 'Seu recurso principal para calculadoras de saude e fitness',
    'footer.section.calculators': 'Calculadoras',
    'footer.section.company': 'Empresa',
    'footer.section.legal': 'Legal',
    'footer.calc.bmi': 'Calculadora de IMC',
    'footer.calc.bodyFat': 'Calculadora de gordura corporal',
    'footer.calc.calorieDeficit': 'Calculadora de deficit calorico',
    'footer.calc.tdee': 'Calculadora de TDEE',
    'footer.company.about': 'Sobre nos',
    'footer.company.editorial': 'Processo editorial',
    'footer.company.contact': 'Contato',
    'footer.company.blog': 'Blog',
    'footer.legal.privacy': 'Politica de privacidade',
    'footer.legal.terms': 'Termos de servico',
    'footer.legal.disclaimer': 'Isencao de responsabilidade',
    'footer.legal.cookies': 'Configuracoes de cookies',
    'footer.trust.reviewed': 'Conteudo revisado por profissionais certificados de saude e fitness',
    'footer.trust.learnProcess': 'Saiba mais sobre nosso processo',
    'footer.medicalDisclaimer':
      'A HealthCheck fornece apenas conteudo e ferramentas informativas gerais. Nada neste site constitui aconselhamento medico. Sempre consulte um profissional de saude qualificado antes de mudar sua dieta, exercicios ou rotina de saude.',
    'footer.rightsReserved': 'Todos os direitos reservados.',
  },
  zh: {
    'layout.skipToMain': '跳转到主要内容',
    'language.label': '语言',
    'header.quick.calculators': '计算器',
    'header.quick.blog': '博客',
    'header.quick.learn': '学习',
    'header.quick.saved': '已保存',
    'header.quickLinksAria': '主要快速链接',
    'header.mobileNavAria': '移动导航',
    'header.openMenu': '打开菜单',
    'header.closeMenu': '关闭菜单',
    'footer.tagline': '你的健康与健身计算器平台',
    'footer.section.calculators': '计算器',
    'footer.section.company': '公司',
    'footer.section.legal': '法律',
    'footer.calc.bmi': 'BMI 计算器',
    'footer.calc.bodyFat': '体脂计算器',
    'footer.calc.calorieDeficit': '热量缺口计算器',
    'footer.calc.tdee': 'TDEE 计算器',
    'footer.company.about': '关于我们',
    'footer.company.editorial': '编辑流程',
    'footer.company.contact': '联系我们',
    'footer.company.blog': '博客',
    'footer.legal.privacy': '隐私政策',
    'footer.legal.terms': '服务条款',
    'footer.legal.disclaimer': '免责声明',
    'footer.legal.cookies': 'Cookie 设置',
    'footer.trust.reviewed': '内容由认证健康和健身专业人士审核',
    'footer.trust.learnProcess': '了解我们的流程',
    'footer.medicalDisclaimer':
      'HealthCheck 仅提供一般信息内容和工具。本站内容不构成医疗建议。在更改饮食、运动或健康方案前，请务必咨询合格的医疗专业人士。',
    'footer.rightsReserved': '保留所有权利。',
  },
};

export function getMessage(locale: SupportedLocale, key: MessageKey): string {
  return MESSAGES[locale][key] ?? MESSAGES.en[key] ?? key;
}
