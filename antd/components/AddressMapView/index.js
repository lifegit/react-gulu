import React, {Component} from "react";
import {Map, Marker, Markers} from "react-amap";
import {
  Col,
  Row,
  Modal,
  Form,
  Input,
  Spin,
} from "antd";
import NumericInput from "@/components/NumericInput";

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 8}
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 16}
  }
};

@Form.create()
export default class AddressMapView extends Component {
  map = null;
  currentCity = null;

  state = {
    center: {},
    id: "",
    markers: [],
    // 经度
    x: "",
    // 纬度
    y: "",
    // 省
    province: "",
    // 市
    city: "",
    // 区
    county: "",
    // 街道
    town: "",
    // 地址
    address: "",
    // 面积
    acreage: "",
    mapState: false,
  };

  componentWillReceiveProps = (props) => {
    let dataSource = props.dataSource;
    if (typeof dataSource === "undefined") {
      return;
    }

    // 如果显示状态为false
    // 重置mapState状态为false，然后停止更新state
    if (!props.visible) {
      this.setState({
        mapState: false
      })
      return;
    } else {
      // 如果显示状态为true
      // 判断mapState状态为true时，停止更新
      if (this.state.mapState) {
        return;
      }
    }
    const {id, x, y, province, city, county, town, address, acreage} = dataSource;

    this.setState({
      id,
      center: {
        longitude: y,
        latitude: x
      },
      x,
      y,
      province,
      city,
      county,
      town,
      address,
      acreage,
      mapState: props.visible
    });

  };

  /**
   * 关闭弹窗
   */
  hideDialog = (value) => {
    this.props.hideDialog({
      ...value
    });
    this.setState({
      id: ""
    });
  };

  /**
   * 更新资料
   */
  handleBindingBankOk = () => {
    if (this.state.x === "") {
      Toast.error("请先在地图中选择坐标！");
      return;
    }
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.hideDialog({
          values,
          ...this.state
        });
      }
    });
  };

  /**
   * 取消
   */
  handleCancel = () => {
    this.hideDialog();
  };

  /**
   * POI搜索
   * @param value
   */
  handleSeatch = (value) => {
    if (!this.map) {
      return;
    }

    let _this = this;

    AMap.plugin("AMap.PlaceSearch", () => {
      let placeSearch = new AMap.PlaceSearch({
        // TODO: city 指定搜索所在城市，支持传入格式有：城市名、citycode和adcode
        // city: _this.currentCity.city
      });

      placeSearch.search(value, function (status, result) {
        // 查询成功时，result即对应匹配的POI信息
        let markers = [];
        result.poiList.pois.map(it => {
          markers.push({
            position: {
              longitude: it.location.lng,
              latitude: it.location.lat
            }
          });
        });
        _this.setState({
          markers: markers
        });
        if (markers.length >= 1) {
          _this.setState({
            center: {
              longitude: markers[0].position.longitude,
              latitude: markers[0].position.latitude
            }
          });
        }
      });
    });
  };

  /**
   * 地图点击
   * @param value
   */
  onMapEvents = (value) => {
    this.geocoder(value);
  };

  /**
   * 逆地理编码
   * @param value
   */
  geocoder = (value) => {

    if (!this.map) {
      return;
    }

    this.setState({
      center: {
        longitude: value.lng,
        latitude: value.lat
      },
    });

    let _this = this;

    AMap.plugin("AMap.Geocoder", () => {
      let geocoder = new AMap.Geocoder({
        // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
        city: _this.currentCity.city
      });
      let lnglat = [value.lng, value.lat];
      geocoder.getAddress(lnglat, function (status, result) {
        console.log(result);
        if (result.info === "OK") {
          // result为对应的地理位置详细信息
          let addressComponent = result.regeocode.addressComponent;
          let town = "";
          if (addressComponent.township === "") {
            town = addressComponent.street
          } else {
            town = addressComponent.township
          }
          _this.setState({
            // 经度
            x: value.lat,
            // 纬度
            y: value.lng,
            // 省
            province: addressComponent.province,
            // 市
            city: addressComponent.city,
            // 区
            county: addressComponent.district,
            // 街道
            town: town
          });
        }
      });
    });
  };

  render() {
    const {visible, isAcreage = false} = this.props;
    const {getFieldDecorator} = this.props.form;
    const {center, markers, province, city, county, town, address, acreage} = this.state;

    const plugins = [
      {
        name: "ToolBar"
      }
    ];


    const events = {
      created: (ins) => {
        this.map = ins;
        this.map.getCity((info) => {
          this.currentCity = info;
        });
      },
      click: (value) => this.onMapEvents(value.lnglat)
    };

    const eventsm = {
      click: (originalMapsEvents, originalMarkerInstance) => {
        this.onMapEvents(originalMapsEvents.lnglat);
      }
    };

    const styleMark = {
      background: `url('http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/map-marker-icon.png')`,
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      width: "30px",
      height: "40px",
      color: "#000",
      textAlign: "center",
      lineHeight: "40px"
    };

    return (
      <Modal
        title="地址"
        visible={visible}
        onOk={this.handleBindingBankOk}
        onCancel={this.handleCancel}
        centered={true}
        destroyOnClose={true}
        okText={"确定"}
      >
        <Row type="flex" justify="center" align="middle">
          <Col span={20}>
            <Input.Search
              placeholder="请输入地址关键词"
              onSearch={value => this.handleSeatch(value)}
              enterButton
            />
          </Col>
        </Row>
        <div id={"container"} style={{height: "60vh", marginTop: "20px"}}>
          {/*{console.log(markers)}*/}
          <Map
            amapkey={"06cad60dc8b0dd74e716ba63cd5e1c1e"}
            version={"1.4.10"}
            plugins={plugins}
            events={events}
            loading={<Spin tip="地图加载中..."/>}
            useAMapUI={true}
            center={!center.longitude ? {longitude: 117.035599, latitude: 36.639452} : center}
          >

            {/*{console.log((!center ? {longitude: 115, latitude: 30} : center))}*/}

            <Markers
              markers={markers}
              events={eventsm}
            />
            {
              !center.longitude ? null :
                <Marker position={center}>
                  <div style={styleMark}>{this.state.value}</div>
                </Marker>
            }
          </Map>
        </div>
        <Form layout="vertical">
          <Row type="flex" justify="center" align="middle">
            <Col span={20}>
              <FormItem label="选择地址" {...formItemLayout} hasFeedback>
                {getFieldDecorator('chAddress', {
                  initialValue: town ? province + city + county + town : '',
                  rules: [{
                    trigger: 'change',
                    required: true,
                    validator: (rule, value, callback) => {
                      value ? callback() : callback(new Error('请选择街道'));
                    },
                  }],
                })(
                  <Input disabled placeholder={"请在图中选择地址"}/>
                )}
              </FormItem>
            </Col>
            <Col span={20}>
              <FormItem label="详细地址" {...formItemLayout} hasFeedback>
                {getFieldDecorator("address", {
                  initialValue: address,
                  rules: [
                    {
                      required: true,
                      message: "请输入详细地址"
                    }
                  ]
                })(<Input/>)}
              </FormItem>
            </Col>
            {
              !isAcreage ? null : (
                <Col span={20}>
                  <FormItem label={<span>面积(M<sup>2</sup>)</span>} {...formItemLayout} hasFeedback>
                    {getFieldDecorator("acreage", {
                      initialValue: acreage,
                      rules: [
                        {
                          required: true,
                          message: "请输入面积"
                        }
                      ]
                    })(<NumericInput/>)}
                  </FormItem>
                </Col>
              )
            }

          </Row>
        </Form>
      </Modal>
    );
  }
}
