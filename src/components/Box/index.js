import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Button } from 'element-react';
import { connectWallet } from '../../constants';
import SalePrice from '../common/SalePrice';
import Account from '../Account';

export default class Box extends React.Component {
  static propTypes = {
    artList: PropTypes.array.isRequired,
    seaport: PropTypes.object.isRequired,
  }

  state = {
    display: 'none',
    left: 0,
    top: 0,
    order: undefined,
    errorMessage: null,
    creatingOrder: false
  };

  async fulfillOrder() {
    const { order } = this.state
    const { accountAddress } = this.props
    if (!accountAddress) {
      await connectWallet()
    }
    try {
      this.setState({ creatingOrder: true })
      console.log(order, accountAddress, 'buying----')
      await this.props.seaport.fulfillOrder({ order, accountAddress })
    } catch(error) {
      this.onError(error)
    } finally {
      this.setState({ creatingOrder: false })
    }
  }

  onError(error) {
    this.setState({ errorMessage: error.message })
    setTimeout(() => this.setState({errorMessage: null}), 3000)
    throw error
  }

  renderBuyButton(canAccept = true) {
    const { creatingOrder, order } = this.state
    const { accountAddress } = this.props
    const buyAsset = async (event) => {
      event.stopPropagation();
      event.preventDefault();
      if (accountAddress && !canAccept) {
        this.setState({
          errorMessage: "You already own this asset!"
        })
        return
      }
      this.fulfillOrder()
    }
    return (
      <Button
        disabled={creatingOrder}
        onClick={buyAsset}
        className="buy"
        type="primary">
        
        Buy{creatingOrder ? "ing" : ""} for {order && <SalePrice order={order} />}

      </Button>
    )
  }

  render() {
    const { artList, orders } = this.props
    const { display, left, top, order } = this.state

    const changeActive = async  (pos, event) => {
      event.stopPropagation();
      const rect = event.target.getBoundingClientRect()
      const display = 'block'
      const leftPos = rect.left - 50 + 'px'
      const topPos = rect.top - 175 + 'px'

      const order = orders && orders.find(v => v.asset.tokenId === String(pos))
      this.setState({
        display,
        left: leftPos,
        top: topPos,
        order
      })
    }

    const handleClose = () => {
      this.setState({
        display: 'none'
      })
    }

    return (
      <BoxDiv>
        <div className="layout" onClick={handleClose}>
          <header>
            <div className="top"></div>
            <div className="logo">
              <img src="/logo.png" alt="logo"/>
            </div>
          </header>
          <div className="container-box">
            <ul className="final">
            {artList.map((v, i) => {
              return <li id={`box${v.pos}`} key={i} style={{background: v.color}} onMouseOver={ e => changeActive(v.pos, e)}/>
            })}
            </ul>
          </div>
          <footer>
          </footer>
          <div className="asset-box" style={{display: display, left, top}}>
            <div className="con">
              <div className="inner-con">
              {
                order ?
                <ul>
                  <li className="name">
                  {order.asset.name} #{order.asset.tokenId}
                  </li>
                  <li>
                    Offered By <Account account={order.makerAccount} />
                  </li>
                  <li className="desc">
                    Description: <b>{order.asset.description}</b>
                  </li>
                </ul> :
                <div>Waiting for trading data...</div>
              }
                {this.renderBuyButton()}
              </div>
            </div>
          </div>
        </div>
      </BoxDiv>
    )
  }
}

const BoxDiv = styled.div`
  .layout {
    .top {
      background: #DE2910;
      height: 48px;
    }
    .logo {
      img {
        margin: 0 auto;
      }
    }
    .container-box {
      width: 820px;
      margin: 40px auto;
      position: relative;
      ul, li {
        list-style-type: none;
      }
      .final {
        overflow: hidden;
      }
      .final {
        li {
          float: left;
          width: 72px;
          height: 48px;
          margin: 5px;
          cursor: pointer;
        }
      }
      #box100 {
        background: #3C3B6E;
      }
    }
    .orders {
      li {
        float: left;
        width: 100px;
        margin: 10px;
        img {
          width: 100%;
        }
      }
    }
    footer {
      position: absolute;
      bottom: 0;
      left: 0;
      background: #3C3B6E;
      width: 100%;
      height: 48px;
    }
    .asset-box {
      position: fixed;
      top: 100px;
      left: 50px;
      width: 240px;
      height: 180px;
      display: none;
      &::before {
        content: '';
        display: block;
        position: absolute;
        z-index: 99;
        width: 120px;
        height: 2px;
        background: #fff;
        bottom: 27px;
        left: 20px;
      }
      &::after {
        content: '';
        display: block;
        position: absolute;
        left: 80px;
        bottom: 15px;
        width: 20px;
        height: 20px;
        border-left: 2px solid #c00;
        border-bottom: 2px solid #c00;
        background: #fff;
        transform: rotate(-45deg);
      }
      .con {
        width: 100%;
        height: 100%;
        background: #fff;
        border:2px solid #c00;
        border-radius: 8px;
        position: relative;
        text-align: left;
        overflow: hidden;
        margin-top: -29px;
        .inner-con {
          margin: 10px;
          height: calc(100% - 10px);
        }
      }
      ul {
        text-align: left;
        font-size: 16px;
        margin: 0;
        li {
          height: 30px;
          line-height: 30px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          &.name {
            font-weight: bold;
          }
          &.desc {
            height: 50px;
            line-height: 25px;
            white-space: normal;
          }
        }
      }
      .buy {
        background: #DE2910;
        border-color: #DE2910;
        margin-top: 10px;
        &.active:focus, &:active:focus {
          box-shadow: none;
        }
      }
    }
  }
`