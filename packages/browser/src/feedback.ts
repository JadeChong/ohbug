import { createEvent, collector } from '@ohbug/core'
import { getGlobal } from '@ohbug/utils'

export const prefix = 'ohbug-feedback'

const styles = `
  .${prefix}-root {
    display: block;
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 999;
    background: rgba(0, 0, 0, 0.5);
    overflow: auto;
  }
  .${prefix}-root * {
    box-sizing: border-box;
    color: #666;
  }

  .${prefix}-dialog {
    max-width: 800px;
    margin: 5% auto 0;
    padding: 36px;
    background: white;
    border-radius: 5px;
  }

  .${prefix}-dialog header {
    text-align: center;
    border-bottom: 1px solid #eee;
    padding-bottom: 18px;
  }
  .${prefix}-dialog header p {
    color: #aaa;
  }

  .${prefix}-content .${prefix}-field {
    overflow: hidden;
  }
  .${prefix}-content .${prefix}-field label {
    display: block;
    margin: 18px 0 10px;
    font-size: 16px;
  }
  .${prefix}-content .${prefix}-field input, .${prefix}-content .${prefix}-field textarea {
    width: 100%;
    padding: 8px 12px;
    background: white;
    outline: none;
    border: 1px solid #ddd;
    border-radius: 2px;
  }
  .${prefix}-submit {
    margin-top: 18px;
  }
  .${prefix}-submit .${prefix}-submit-btn {
    outline: none;
    border: none;
    padding: 0 20px;
    height: 36px;
    background-color: #3751ff;
    color: white;
    font-size: 16px;
    border-radius: 4px;
    cursor: pointer;
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
    transition: background 0.3s ease;
    margin-right: 12px;
  }
  .${prefix}-submit .${prefix}-submit-btn:hover {
    background-color: #617bff;
  }
  .${prefix}-submit-close {
    cursor: pointer;
  }
  .${prefix}-submit-close:hover {
    text-decoration: underline;
  }
`

interface OElement {
  type: string
  props?: any
  children?: OElement | OElement[] | string | number
}
function render(element: OElement, container: Element): HTMLElement {
  const { type, props, children } = element

  const window = getGlobal<Window>()

  const dom = window.document.createElement(type)

  // map props
  for (const propName in props) {
    const value = props[propName]
    if (propName === 'style') {
      const { style } = props
      for (const styleKey in style) {
        // @ts-ignore
        dom[propName][styleKey] = style[styleKey]
      }
      continue
    } else if (propName[0] === 'o' && propName[1] === 'n') {
      const name = propName.slice(2).toLowerCase()
      dom.addEventListener(name, value)
    } else if (!value) {
      dom.removeAttribute(propName)
    } else {
      dom.setAttribute(propName, value)
    }
  }

  // handle children
  if (children) {
    if (typeof children === 'string' || typeof children === 'number') {
      const text = window.document.createTextNode(children.toString())
      dom.appendChild(text)
    } else if (Array.isArray(children)) {
      children.forEach(child => {
        render(child, dom)
      })
    } else {
      render(children, dom)
    }
  }

  // append
  container.appendChild(dom)

  return dom
}

function feedback(): HTMLElement {
  let dom: HTMLElement
  const handleClose = () => {
    window.document.body.removeChild(dom)
  }
  const element: OElement = {
    type: 'div',
    props: {
      class: `${prefix}-root`,
      'data-testid': `${prefix}-root`
    },
    children: [
      {
        type: 'style',
        children: styles
      },
      {
        type: 'div',
        props: {
          class: `${prefix}-dialog`
        },
        children: [
          {
            type: 'header',
            children: [
              {
                type: 'h2',
                children: `似乎发生了一些问题。`
              },
              {
                type: 'p',
                children: `如果您愿意提供帮助，可以在下方填写问题以便告诉我们发生了什么。`
              }
            ]
          },
          {
            type: 'form',
            props: {
              action: '',
              method: 'post',
              onSubmit: (e: Event): void => {
                e.preventDefault()

                const name = (window.document.querySelector(`#${prefix}-name`) as HTMLInputElement)
                  .value
                const email = (window.document.querySelector(
                  `#${prefix}-email`
                ) as HTMLInputElement).value
                const comments = (window.document.querySelector(
                  `#${prefix}-comments`
                ) as HTMLTextAreaElement).value
                const data = {
                  name,
                  email,
                  comments
                }
                const event = createEvent('FEEDBACK', data, 'feedback')
                collector(event, 'sync')

                handleClose()
              }
            },
            children: [
              {
                type: 'div',
                props: {
                  class: `${prefix}-content`
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      class: `${prefix}-field`
                    },
                    children: [
                      {
                        type: 'label',
                        props: {
                          for: `${prefix}-name`
                        },
                        children: '姓名'
                      },
                      {
                        type: 'input',
                        props: {
                          type: 'text',
                          id: `${prefix}-name`,
                          placeholder: 'Cxy',
                          maxlength: 128,
                          required: true
                        }
                      }
                    ]
                  },
                  {
                    type: 'div',
                    props: {
                      class: `${prefix}-field`
                    },
                    children: [
                      {
                        type: 'label',
                        props: {
                          for: `${prefix}-email`
                        },
                        children: '电子邮件'
                      },
                      {
                        type: 'input',
                        props: {
                          type: 'email',
                          id: `${prefix}-email`,
                          placeholder: 'Cxy@example.com',
                          maxlength: 75,
                          required: true
                        }
                      }
                    ]
                  },
                  {
                    type: 'div',
                    props: {
                      class: `${prefix}-field`
                    },
                    children: [
                      {
                        type: 'label',
                        props: {
                          for: `${prefix}-comments`
                        },
                        children: '发生了什么'
                      },
                      {
                        type: 'textarea',
                        props: {
                          id: `${prefix}-comments`,
                          placeholder: '我点击了按钮 A',
                          required: true,
                          rows: 10,
                          cols: 40
                        }
                      }
                    ]
                  }
                ]
              },
              {
                type: 'div',
                props: {
                  class: `${prefix}-submit`
                },
                children: [
                  {
                    type: 'button',
                    props: {
                      type: 'submit',
                      class: `${prefix}-submit-btn`
                    },
                    children: '提交'
                  },
                  {
                    type: 'a',
                    props: {
                      class: `${prefix}-submit-close`,
                      onClick: () => {
                        handleClose()
                      }
                    },
                    children: '关闭'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
  dom = render(element, window.document.body)
  return dom
}

export default feedback
