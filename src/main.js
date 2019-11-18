const log = console.log.bind(console)

const $siteList = $('.siteList')
const $lastLi = $siteList.find('li.last')
const x = localStorage.getItem('x')
const xObject = JSON.parse(x)
const hashMap = xObject || [
  {logo: 'images/figma.svg', logoType: 'img', url: 'https://www.figma.com/'},
  {logo: 'images/iconfont.ico', logoType: 'img', url: 'https://www.iconfont.cn/'}
]
const simplifyUrl = (url) => {
  return url.replace('https://', '')
    .replace('http://', '')
    .replace('www.', '')
    .replace(/\/.*/, '') // 删除 / 开头的内容
}

const $input = $('input')
$input.on('keypress', (e) => {
    e.stopPropagation() // 阻止冒泡
})

const render = () => {
  $siteList.find('li:not(.last)').remove()
  hashMap.forEach((node, index) => {
    let $li
    if(node.logoType === 'img'){
        $li = $(`
        <li>
            <a href="${node.url}">
                <div class="site">
                    <div class="logo">
                        <img src=${node.logo} alt="">
                    </div>
                    <div class="link">${simplifyUrl(node.url)}</div>
                    <div class="close">
                        <svg class="icon">
                            <use xlink:href="#icon-close"></use>
                        </svg>
                    </div>
                </div>
            </a>
        </li>`)
    } else {
        $li = $(`
        <li>
            <a href="${node.url}">
                <div class="site">
                    <div class="logo">${node.logo}</div>
                    <div class="link">${simplifyUrl(node.url)}</div>
                    <div class="close">
                        <svg class="icon">
                            <use xlink:href="#icon-close"></use>
                        </svg>
                    </div>
                </div>
            </a>
        </li>
        `)
    }
    $li.insertBefore($lastLi)
    // $li.on('click', () => {
    //   window.open(node.url)
    // })
    $li.on('click', '.close', (e) => {
      e.stopPropagation() // 阻止冒泡
      hashMap.splice(index, 1)
      render()
      return false
    })
  })
}

render()

$('.addButton').on('click', () => {
  let url = window.prompt('请问你要添加的网址是啥？')
  if (url.indexOf('http') !== 0) {
    url = 'https://' + url
  }
  console.log(url)
  hashMap.push({
    logo: simplifyUrl(url)[0].toUpperCase(),
    logoType: 'text',
    url: url,
  })
  render()
})

window.onbeforeunload = () => {
  const string = JSON.stringify(hashMap)
  localStorage.setItem('x', string)
}

$(document).on('keypress', (e) => {
  const {key} = e
  for (let i = 0; i < hashMap.length; i++) {
    if (simplifyUrl(hashMap[i].url)[0].toLowerCase() === key) {
      window.open(hashMap[i].url, "_self")
    }
  }
})