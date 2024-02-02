import axios from 'axios';

export const baseURL = 'https://tp-tdp2.herokuapp.com'

const IdiomaPlayApi = axios.create({baseURL})


export default IdiomaPlayApi