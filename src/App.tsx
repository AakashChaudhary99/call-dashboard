
import CallDuration from './components/CallDuration';
import SadPathAnalysis from './components/SadPathAnalysis';
const App = () => {

  return (
    <div style={{
      width: '100%',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      gap: "10px"
    }}>
      

      <div style={{
        background: "#0C090A"
      }}>
        <CallDuration />
      </div>

      <div style={{background:'black'}}>
        <SadPathAnalysis />
      </div>

    </div>
  )
}

export default App