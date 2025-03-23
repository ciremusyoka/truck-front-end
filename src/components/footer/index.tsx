import { Flex } from 'antd'
import styles from './footer.module.css'

const Footer = () => {
    return (
        <Flex justify="center" align="center" className={styles.text}>
            <div>All rights reserved © Spotter AI.</div>
        </Flex>
    )
}

export default Footer