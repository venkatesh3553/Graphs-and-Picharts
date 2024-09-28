// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class CowinDashboard extends Component {
  state = {list: {}, status: apiStatusConstants.initial}

  componentDidMount() {
    this.getVaccination()
  }

  getVaccination = async () => {
    this.setState({status: apiStatusConstants.inProgress})

    const response = await fetch('https://apis.ccbp.in/covid-vaccination-data')
    if (response.ok) {
      const data = await response.json()
      const updateList = {
        last7DaysVaccination: data.last_7_days_vaccination.map(eachItem => ({
          dose1: eachItem.dose_1,
          dose2: eachItem.dose_2,
          vaccineDate: eachItem.vaccine_date,
        })),

        vaccinationByAge: data.vaccination_by_age.map(eachItem => ({
          age: eachItem.age,
          count: eachItem.count,
        })),

        vaccinationByGender: data.vaccination_by_gender.map(eachItem => ({
          count: eachItem.count,
          gender: eachItem.gender,
        })),
      }

      this.setState({list: updateList, status: apiStatusConstants.success})
    } else {
      this.setState({status: apiStatusConstants.failure})
    }
  }

  renderSuccess = () => {
    const {list} = this.state
    return (
      <>
        <VaccinationCoverage list={list.last7DaysVaccination} />
        <VaccinationByAge list={list.vaccinationByAge} />
        <VaccinationByGender list={list.vaccinationByGender} />
      </>
    )
  }

  renderFail = () => (
    <div className="fail-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png "
        className="fail-img"
        alt="failure view"
      />
      <h1 className="fail-head">Something went wrong</h1>
    </div>
  )

  renderLoder = () => (
    <div className="loading" data-testid="loader">
      <Loader color="#ffffff" height={80} type="ThreeDots" width={80} />
    </div>
  )

  showOutPut = () => {
    const {status} = this.state
    switch (status) {
      case apiStatusConstants.success:
        return this.renderSuccess()
      case apiStatusConstants.failure:
        return this.renderFail()
      case apiStatusConstants.inProgress:
        return this.renderLoder()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="container">
        <div className="nav">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png "
            className="logo"
            alt="website logo"
          />
          <h1 className="logo-head">Co-WIN</h1>
        </div>
        <h1 className="heading">CoWIN Vaccination in India</h1>
        {this.showOutPut()}
      </div>
    )
  }
}

export default CowinDashboard
