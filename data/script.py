# 自动生成resource mapping
import json

with open('./companies.json', 'r', encoding='utf-8') as f:
  companies = json.load(f)

# print(companies)

data = {}

for com in companies:
  if 'src' in com:
    if type(com['src']).__name__ == 'list':
      for s in com['src']:
        data[s] = f'require(\'../assets/companies{s}\')'
    elif type(com['src']).__name__ == 'str':
      data[com['src']] = f'require(\'../assets/companies{com["src"]}\')'
  if 'poster' in com:
    if type(com['poster'].__name__ == 'str'):
      data[com['poster']] = f'require(\'../assets/companies{com["poster"]}\')'
  if 'product' in com:
    if type(com['product']).__name__ == 'list':
      for p in com['product']:
        if 'src' in p:
          data[p['src']] = f'require(\'../assets/companies{p["src"]}\')'
  if 'logo' in com:
    data[com['logo']] = f'require(\'../assets/companies{com["logo"]}\')'


with open('./resourceMapping.json', 'w', encoding='utf-8') as f:
  json.dump(data, f, ensure_ascii=False, indent=2)
# print(data)
