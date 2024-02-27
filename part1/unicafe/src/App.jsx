import { useState } from 'react'

const Header = ({title}) => <h1>{title}</h1>

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)



const StatisticLine = ({text, value}) => <tr><td>{text}</td><td>{value}</td></tr>

const Statistics = ({stats}) => {
  if(stats.total === 0){
    return(
      <div>No feedback given</div>
    )
  }
  return(
    <table>
      <thead>
      </thead>
      <tbody>
        <StatisticLine text="good" value ={stats.feedbacks[0].total} />
        <StatisticLine text="neutral" value ={stats.feedbacks[1].total} />
        <StatisticLine text="bad" value ={stats.feedbacks[2].total} />
        <StatisticLine text="all" value ={stats.feedbacks[3].total} />
        <StatisticLine text="average" value ={stats.feedbacks[4].total} />
        <StatisticLine text="positive" value ={stats.feedbacks[5].total} />
      </tbody>
      <tfoot>
      </tfoot>
    </table>
  )
}


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  const [average, setAverage] = useState(0)
  const [averageSum, setAverageSum] = useState(0)
  const [percentPos, setPercentPos] = useState(0)

  const handleGoodClick = () => {
    const updateGood = good + 1
    setGood(updateGood)
    const updateTotal = updateGood + neutral + bad
    setTotal(updateTotal)
    const updateAverageSum = averageSum + 1
    setAverageSum(updateAverageSum)
    const updateAverage =  updateAverageSum / updateTotal
    setAverage (updateAverage)
    positivePercent(updateGood, updateTotal)
  }
  const handleNeutralClick = () => {
    const updateNeutral= neutral + 1
    setNeutral(updateNeutral)
    const updateTotal = good + updateNeutral + bad
    setTotal(updateTotal)
    const updateAverage =  averageSum / updateTotal
    setAverage (updateAverage)
    positivePercent(good, updateTotal)
  }
  const handleBadClick = () => {
    const updateBad = bad + 1
    setBad(updateBad)
    const updateTotal = good + neutral + updateBad
    setTotal(updateTotal)
    const updateAverageSum = averageSum - 1
    setAverageSum(updateAverageSum)
    const updateAverage =  updateAverageSum / updateTotal
    setAverage (updateAverage)
    positivePercent(good, updateTotal)

  }

  const positivePercent = (theGood, theTotal) => {
    const updatePercent = 100 * theGood / theTotal
    setPercentPos(updatePercent)
  }

  const stats = {
    total: total,
    feedbacks: [
      {
        name: 'good',
        total: good
      },
      {
        name: 'neutral',
        total: neutral
      },
      {
        name: 'bad',
        total: bad
      },
      {
        name: 'total',
        total: total
      },
      {
        name: 'average',
        total: average
      },
      {
        name: 'positive',
        total: percentPos + ' %'
      }
    ]
  }

  return (
    <div>
      <Header title = 'give feedback'/>
      <Button handleClick={handleGoodClick} text='good' />
      <Button handleClick={handleNeutralClick} text='neutral' />
      <Button handleClick={handleBadClick} text='bad' />
      <Header title = 'statistics'/>
      <Statistics stats = {stats}/>   
    </div>
  )
}

export default App
