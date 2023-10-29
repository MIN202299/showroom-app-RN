import { Theme } from '../store/constant'
import { companyData as dropleton } from './dropleton2'
import { companyData as companies } from './companies'
import { companyData as lianCheng } from './lian_cheng'
import { companyData as yiJiu } from './yi_jiu'

const data = {
  [Theme.DEFAULT]: [], // 默认主题在每个屏幕中自己判断,
  [Theme.COMPANY_INTRO]: companies,
  [Theme.DROPLETON]: dropleton,
  [Theme.LIAN_Cheng]: lianCheng,
  [Theme.YI_JIU]: yiJiu,
}

export default data
