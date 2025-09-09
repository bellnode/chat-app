import { AppBar, Box } from '@mui/material'
import React from 'react'
import { orange } from '../../constants/color'

const Header = () => {
  return (
    <>
        <Box sx={{flexGrow : 1}} height={'4rem'}>
            <AppBar position='static' sx={{bgcolor : orange ,  height:'4rem' , display:'flex',flexDirection:'row' , alignItems:'center',paddingLeft:'5px'}}>
                <span className='font-mono text-3xl'>Tangy Talks</span>
            </AppBar>

        </Box>
    </>
  )
}

export default Header