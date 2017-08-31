import React, { Component } from 'react';
import './App.css';
import xhr from 'xhr';
import Plot from './Components/Plot';

class App extends Component {

  state = {
    location: '',
    data: {},
    dates: [],
    temps: []
  };

  fetchData = (evt) => {
    evt.preventDefault();

    var location = encodeURIComponent(this.state.location);
    var urlPrefix = 'http://api.openweathermap.org/data/2.5/forecast?q=';
    var urlSuffix = '&APPID=8253673cbabaf2855e482f9dcb7fb258&units=metric';
    var url = urlPrefix + location + urlSuffix;
    
    var self = this;

    xhr({
      url: url
    }, function (err, data) {
      var body = JSON.parse(data.body);
      var list = body.list;
      var dates = [];
      var temps = [];
      for (var i = 0; i < list.length; i++) {
        dates.push(list[i].dt_txt);
        temps.push(list[i].main.temp);
      }

      self.setState({
        data: body,
        dates: dates,
        temps: temps
      });
    });
  }

  changeLocation = (evt) => {
    this.setState({
      location: evt.target.value
    });
  }

  render() {

    var currentTemp = 'not loaded';
    if(this.state.data.list) {
      currentTemp = this.state.data.list[0].main.temp;
    }

    return (
      <div className="wrapper">
        <h1>Weather</h1>
        <form onSubmit={this.fetchData}>
          <label> Please enter location for which you want to show weather: 
            <input placeholder={"City, Country"} type="text" value={this.state.location} onChange={this.changeLocation} />
          </label>
        </form>

        {(this.state.data.list) ? (
          <div className="wrapper">
            <p className="temp-wrapper">
              <span className="temp">{ currentTemp }</span>
              <span className="temp-symbol">°C</span>
            </p>
            <h2>Forecast</h2>
            <Plot
              xData={this.state.dates}
              yData={this.state.temps}
              type="scatter"
            />
          </div>
        ) : null}

      </div>
    );
  }
}

export default App;
