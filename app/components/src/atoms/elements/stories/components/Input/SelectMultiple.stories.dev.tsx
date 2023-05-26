import { Input } from '~/src/atoms/components/Input';
import { withDesign } from 'storybook-addon-designs';
import { Meta } from '@storybook/react';
import '~/styles/index.css';

function mockFunction(value: any): any {
  // console.log(value);
}

const languages_list = [
  {name: 'Afrikaans', fullname:"Afrikaans", code:"af"},
  {name: 'Albanian', fullname:"Albanian - shqip", code:"sq"},
  {name: 'Amharic', fullname:"Amharic - አማርኛ", code:"am"},
  {name: 'Arabic', fullname:"Arabic - العربية", code:"ar"},
  {name: 'Aragonese', fullname:"Aragonese - aragonés", code:"an"},
  {name: 'Armenian', fullname:"Armenian - հայերեն", code:"hy"},
  {name: 'Asturian', fullname:"Asturian - asturianu", code:"ast"},
  {name: 'Azerbaijani', fullname:"Azerbaijani - azərbaycan dili", code:"az"},
  {name: 'Basque', fullname:"Basque - euskara", code:"eu"},
  {name: 'Belarusian', fullname:"Belarusian - беларуская", code:"be"},
  {name: 'Bengali', fullname:"Bengali - বাংলা", code:"bn"},
  {name: 'Bosnian', fullname:"Bosnian - bosanski", code:"bs"},
  {name: 'Breton', fullname:"Breton - brezhoneg", code:"br"},
  {name: 'Bulgarian', fullname:"Bulgarian - български", code:"bg"},
  {name: 'Catalan', fullname:"Catalan - català", code:"ca"},
  {name: 'Central Kurdish', fullname:"Central Kurdish - کوردی (دەستنوسی عەرەبی)", code:"ckb"},
  {name: 'Chinese', fullname:"Chinese - 中文", code:"zh"},
  {name: 'Chinese（香港)', fullname:"Chinese (Hong Kong) - 中文（香港）", code:"zh-HK"},
  {name: 'Chinese（简体)', fullname:"Chinese (Simplified) - 中文（简体）", code:"zh-CN"},
  {name: 'Chinese（繁體)', fullname:"Chinese (Traditional) - 中文（繁體）", code:"zh-TW"},
  {name: 'Corsican', fullname:"Corsican", code:"co"},
  {name: 'Croatian', fullname:"Croatian - hrvatski", code:"hr"},
  {name: 'Czech', fullname:"Czech - čeština", code:"cs"},
  {name: 'Danish', fullname:"Danish - dansk", code:"da"},
  {name: 'Dutch', fullname:"Dutch - Nederlands", code:"nl"},
  {name: 'English', fullname:"English", code:"en"},
  {name: 'Esperanto', fullname:"Esperanto - esperanto", code:"eo"},
  {name: 'Estonian', fullname:"Estonian - eesti", code:"et"},
  {name: 'Faroese', fullname:"Faroese - føroyskt", code:"fo"},
  {name: 'Filipino', fullname:"Filipino", code:"fil"},
  {name: 'Finnish', fullname:"Finnish - suomi", code:"fi"},
  {name: 'French', fullname:"French - français", code:"fr"},
  {name: 'Galician', fullname:"Galician - galego", code:"gl"},
  {name: 'Georgian', fullname:"Georgian - ქართული", code:"ka"},
  {name: 'German', fullname:"German - Deutsch", code:"de"},
  {name: 'Greek', fullname:"Greek - Ελληνικά", code:"el"},
  {name: 'Guarani', fullname:"Guarani", code:"gn"},
  {name: 'Gujarati', fullname:"Gujarati - ગુજરાતી", code:"gu"},
  {name: 'Hausa', fullname:"Hausa", code:"ha"},
  {name: 'Hawaiian', fullname:"Hawaiian - ʻŌlelo Hawaiʻi", code:"haw"},
  {name: 'Hebrew', fullname:"Hebrew - עברית", code:"he"},
  {name: 'Hindi', fullname:"Hindi - हिन्दी", code:"hi"},
  {name: 'Hungarian', fullname:"Hungarian - magyar", code:"hu"},
  {name: 'Icelandic', fullname:"Icelandic - íslenska", code:"is"},
  {name: 'Indonesian', fullname:"Indonesian - Indonesia", code:"id"},
  {name: 'Interlingua', fullname:"Interlingua", code:"ia"},
  {name: 'Irish', fullname:"Irish - Gaeilge", code:"ga"},
  {name: 'Italian', fullname:"Italian - italiano", code:"it"},
  {name: 'Japanese', fullname:"Japanese - 日本語", code:"ja"},
  {name: 'Kannada', fullname:"Kannada - ಕನ್ನಡ", code:"kn"},
  {name: 'Kazakh', fullname:"Kazakh - қазақ тілі", code:"kk"},
  {name: 'Khmer', fullname:"Khmer - ខ្មែរ", code:"km"},
  {name: 'Korean', fullname:"Korean - 한국어", code:"ko"},
  {name: 'Kurdish', fullname:"Kurdish - Kurdî", code:"ku"},
  {name: 'Kyrgyz', fullname:"Kyrgyz - кыргызча", code:"ky"},
  {name: 'Lao', fullname:"Lao - ລາວ", code:"lo"},
  {name: 'Latin', fullname:"Latin", code:"la"},
  {name: 'Latvian', fullname:"Latvian - latviešu", code:"lv"},
  {name: 'Lingala', fullname:"Lingala - lingála", code:"ln"},
  {name: 'Lithuanian', fullname:"Lithuanian - lietuvių", code:"lt"},
  {name: 'Macedonian', fullname:"Macedonian - македонски", code:"mk"},
  {name: 'Malay', fullname:"Malay - Bahasa Melayu", code:"ms"},
  {name: 'Malayalam', fullname:"Malayalam - മലയാളം", code:"ml"},
  {name: 'Maltese', fullname:"Maltese - Malti", code:"mt"},
  {name: 'Marathi', fullname:"Marathi - मराठी", code:"mr"},
  {name: 'Mongolian', fullname:"Mongolian - монгол", code:"mn"},
  {name: 'Nepali', fullname:"Nepali - नेपाली", code:"ne"},
  {name: 'Norwegian', fullname:"Norwegian - norsk", code:"no"},
  {name: 'Norwegian Bokmål', fullname:"Norwegian Bokmål - norsk bokmål", code:"nb"},
  {name: 'Norwegian Nynorsk', fullname:"Norwegian Nynorsk - nynorsk", code:"nn"},
  {name: 'Occitan', fullname:"Occitan", code:"oc"},
  {name: 'Oriya', fullname:"Oriya - ଓଡ଼ିଆ", code:"or"},
  {name: 'Oromo', fullname:"Oromo - Oromoo", code:"om"},
  {name: 'Pashto', fullname:"Pashto - پښتو", code:"ps"},
  {name: 'Persian', fullname:"Persian - فارسی", code:"fa"},
  {name: 'Polish', fullname:"Polish - polski", code:"pl"},
  {name: 'Portuguese', fullname:"Portuguese - português", code:"pt"},
  {name: 'Punjabi', fullname:"Punjabi - ਪੰਜਾਬੀ", code:"pa"},
  {name: 'Quechua', fullname:"Quechua", code:"qu"},
  {name: 'Romanian', fullname:"Romanian - română", code:"ro"},
  {name: 'Romanian', fullname:"Romanian (Moldova) - română (Moldova)", code:"mo"},
  {name: 'Romansh', fullname:"Romansh - rumantsch", code:"rm"},
  {name: 'Russian', fullname:"Russian - русский", code:"ru"},
  {name: 'Scottish Gaelic', fullname:"Scottish Gaelic", code:"gd"},
  {name: 'Serbian', fullname:"Serbian - српски", code:"sr"},
  {name: 'Serbo', fullname:"Serbo - Croatian", code:"sh"},
  {name: 'Shona', fullname:"Shona - chiShona", code:"sn"},
  {name: 'Sindhi', fullname:"Sindhi", code:"sd"},
  {name: 'Sinhala', fullname:"Sinhala - සිංහල", code:"si"},
  {name: 'Slovak', fullname:"Slovak - slovenčina", code:"sk"},
  {name: 'Slovenian', fullname:"Slovenian - slovenščina", code:"sl"},
  {name: 'Somali', fullname:"Somali - Soomaali", code:"so"},
  {name: 'Southern Sotho', fullname:"Southern Sotho", code:"st"},
  {name: 'Spanish', fullname:"Spanish - español", code:"es"},
  {name: 'Sundanese', fullname:"Sundanese", code:"su"},
  {name: 'Swahili', fullname:"Swahili - Kiswahili", code:"sw"},
  {name: 'Swedish', fullname:"Swedish - svenska", code:"sv"},
  {name: 'Tajik', fullname:"Tajik - тоҷикӣ", code:"tg"},
  {name: 'Tamil', fullname:"Tamil - தமிழ்", code:"ta"},
  {name: 'Tatar', fullname:"Tatar", code:"tt"},
  {name: 'Telugu', fullname:"Telugu - తెలుగు", code:"te"},
  {name: 'Thai', fullname:"Thai - ไทย", code:"th"},
  {name: 'Tigrinya', fullname:"Tigrinya - ትግርኛ", code:"ti"},
  {name: 'Tongan', fullname:"Tongan - lea fakatonga", code:"to"},
  {name: 'Turkish', fullname:"Turkish - Türkçe", code:"tr"},
  {name: 'Turkmen', fullname:"Turkmen", code:"tk"},
  {name: 'Twi', fullname:"Twi", code:"tw"},
  {name: 'Ukrainian', fullname:"Ukrainian - українська", code:"uk"},
  {name: 'Urdu', fullname:"Urdu - اردو", code:"ur"},
  {name: 'Uyghur', fullname:"Uyghur", code:"ug"},
  {name: 'Uzbek', fullname:"Uzbek - o‘zbek", code:"uz"},
  {name: 'Vietname', fullname:"Vietname: '', fullnamese - Tiếng Việt", code:"vi"},
  {name: 'Walloon', fullname:"Walloon - wa", code:"wa"},
  {name: 'Welsh', fullname:"Welsh - Cymraeg", code:"cy"},
  {name: 'Western Frisian', fullname:"Western Frisian", code:"fy"},
  {name: 'Xhosa', fullname:"Xhosa", code:"xh"},
  {name: 'Yiddish', fullname:"Yiddish", code:"yi"},
  {name: 'Yoruba', fullname:"Yoruba - Èdè Yorùbá", code:"yo"},
  {name: 'Zulu', fullname:"Zulu - isiZulu", code:"zu"}
];

const langOptions = languages_list.map(({name, code: value}: any) => {
  return { name, value}
})

export default {
  component: Input,
  title: 'Data Handle / Input',
  args: {
    type: 'select',
    id: 'language_id',
    label: 'Select a language',
    options: langOptions,
    multiple: true
  },
  decorators: [withDesign]
};

export const SelectMultiple = (args: any) => (
  <Input {...args} />
);

SelectMultiple.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/vkIFRuwbONhF3qrGI7bHvL/App?node-id=2%3A129'
  }
};
