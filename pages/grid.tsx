import { NextPage } from "next"
import styles from '../styles/Grid.module.css'

const Grid: NextPage = () => {
  return (
    <div id='container' className={styles.container}>
      {Array(10).fill("").map((v, i) =>
        <div className={styles.card} key={i}>
          <div>Card {i}</div>
          <p>Some text about something</p>
        </div>
      )}
    </div>
  )
}
export default Grid