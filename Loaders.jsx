import React from 'react'
import { Grid,Skeleton, Stack } from '@mui/material'

export const LayoutLoader = () => {
  return (

    <Grid container height={'100vh'} spacing={'1rem'}>
                    <Grid  item xs={2} sm={1} >
                        <Skeleton height={'100vh'} variant='rectangular'/>
                    </Grid>
                    <Grid item sm={4}  borderColor={'orange'} sx={{display:{
                        xs:'none' , sm:'block'
                    }}}>
                        <Stack>
                            <Skeleton height={'5rem'} />
                            <Skeleton height={'5rem'} />
                            <Skeleton height={'5rem'} />
                            <Skeleton height={'5rem'} />
                            <Skeleton height={'5rem'} />
                            <Skeleton height={'5rem'} />
                            <Skeleton height={'5rem'} />
                            <Skeleton height={'5rem'} />
                        </Stack>
                    </Grid>
                    <Grid item xs={10} sm={7}  bgcolor={'white'}>
                    <Skeleton height={'100vh'} variant='rectangular'/>
                    </Grid>
                </Grid>
    
  )
}

