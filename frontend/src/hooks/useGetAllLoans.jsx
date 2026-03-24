import { LOAN_API_ENDPOINT } from '@/components/utils/constant'
import { setAllLoans } from '@/redux/loanSlice';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllLoans = () => {
    const dispatch=useDispatch();
 useEffect(()=>{
    const fetchAllLoans=async ()=>{
        try {
            const res=await axios.get(`${LOAN_API_ENDPOINT}/get`,{withCredentials:true});
            if(res.data.success){
                dispatch(setAllLoans(res.data.loans));
                console.log(res.data.loans);
            }
        } catch (error) {
            console.log(error);
        }
    }
    fetchAllLoans();
 },[])
}

export default useGetAllLoans;