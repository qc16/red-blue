import React from 'react';
import PropTypes from 'prop-types';
import { Loading, Message } from 'element-react';
import Box from '../Box'
import { generateBoxes, calcGradient } from '../../util';

export default class Log extends React.Component {
  static propTypes = {
    seaport: PropTypes.object.isRequired,
    accountAddress: PropTypes.string
  };

  state = {
    artList: [],
    orders: undefined,
    total: 0,
    side: undefined,
    onlyBundles: false,
    page: 1,
    loading: true
  };

  componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    let artList = generateBoxes()

    let colorArr = calcGradient('#DE2910', '#3C3B6E', 99);

    artList = artList.map(v => {
      v.color = colorArr[v.pos - 1]
      return v
    })

    this.setState({ artList })

    try {
      const { orders, count } = await this.props.seaport.api.getOrders({
        owner: '0x9999996A1914831D5c559cf2E305e89158c0c4Bb',
        side: this.state.side,
        limit: 100
        // Possible query options:
        // 'asset_contract_address'
        // 'taker'
        // 'token_id'
        // 'token_ids'
        // 'sale_kind'
      }, this.state.page)

    this.setState({ orders, total: count, loading: false })
    } catch (error) {
      console.log(error, 'get orders error')
      this.setState({ loading: false }, () => {
        Message({
          showClose: true,
          message: 'Get assets error, please try again',
          type: 'error',
          duration: 0
        });
      })
    }
  }

  render() {
    const { orders, artList, loading } = this.state
    const { accountAddress } = this.props
    return (
      <div id="Log">
        <Loading className={orders && 'box-loading'} text="Waiting for assets ready..." fullscreen={true} loading={loading}>
        <Box artList={artList} orders={orders} seaport={this.props.seaport} accountAddress={accountAddress}/>
        {/* {orders != null
        
          ? <React.Fragment>
              <div className="card-deck">
                {orders.map((order, i) => {
                  return <Order {...this.props} key={i} order={order}  />
                })}
              </div>
            </React.Fragment>

          : <div className="text-center">Loading...</div>
        } */}
        </Loading>
      </div>
    );
  }
}
