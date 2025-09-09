import React from 'react'
import {Helmet} from 'react-helmet-async'

const Title = ({title = 'Tangy Talks | Your chat app on the web' , desc = 'Best Chat App on the web'}) => {
  return (
    <Helmet>
        <title>{title}</title>
        <meta name="description" content={desc} />
    </Helmet>
  )
}

export default Title