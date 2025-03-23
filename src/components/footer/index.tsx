import { Flex } from 'antd'
import styles from './footer.module.css'

const Footer = () => {
    return (
        // <footer className={styles.footer}>
            <Flex justify="center" align="center" className={styles.text}>
                <div>All rights reserved © Spotter AI.</div>
            </Flex>
        // </footer>
    )
}

export default Footer