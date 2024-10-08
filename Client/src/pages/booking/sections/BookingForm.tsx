import React, { useState } from 'react';
import Form from '../../../compoments/form/Form';
import FormInput from '../../../compoments/form/FormInput';
import FormSelect from '../../../compoments/form/FormSelect';
import { additionalOptions as addOptions } from '../../../utils/data';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingValidationSchema } from '../../../utils/validationSchema';
import { useCreateBookingMutation } from '../../../redux/features/booking/booking.api';
import LoadingModal from '../../../compoments/modal/LoadingModal';
import { useGetMeQuery } from '../../../redux/features/auth/auth.api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { TCar } from '../../../types';
import { useAppSelector } from '../../../redux/hook';

type TBooKingFormProps = {
  car: TCar;
};
const BookingForm = ({ car}: TBooKingFormProps) => {
  const [error, setError] = useState('');
  const navigate = useNavigate()

  const token = useAppSelector(state=>state.auth.token)
  
  const [createBooking, { isLoading }] = useCreateBookingMutation();
  const { data } = useGetMeQuery(undefined);
  const user = data?.data;
  
  const onSubmit = async (values: any) => {
    if(!token){
      navigate('/auth/login')
    }
    const data: any = {
      carId: car._id,
      startTime: new Date().toISOString(),
      pricePerHour: car.pricePerHour,
      bookerInfo: {
        drivingLicense: values.drivingLicense,
      },
    };


    if (!values.passport || !values.nid) {
      setError('NID or Passport is required');
      return;
    }
    if (values.passport) {
      data.bookerInfo.passport = values.passport;
    }
    if (values.nid) {
      data.bookerInfo.nid = values.nid;
    }


    const res = await createBooking(data);
    if (res?.error || !res?.data) {
      toast.error('Something went wrong', { duration: 3000 });
    } else {
      // toast.success('Booking successful', { duration: 3000 });
   
      navigate(`/booking-confirm/${res?.data?.data?._id}`)

    }
  };

  const additionalOptions = addOptions.map((item: string) => ({
    display: item,
    value: item,
  }));

  return (
    <div className="mt-5">
      <h1 className="text-3xl font-semibold dark:text-slate-50 ">
        Booking Form
      </h1>
      <div className="mt-5">
        <Form
          onSubmit={onSubmit}
          resolver={zodResolver(bookingValidationSchema)}
          reset={true}
        >
          <FormInput name="nid" label="NID Number " type="text" />
          <FormInput name="passport" label="Passport Number " type="text" />
          <FormSelect
            name="additionalOption"
            label="Select Additional option (optional)"
            options={additionalOptions}
          />
          <FormInput
            name="drivingLicense"
            label="Driving License "
            type="text"
          />
           <button disabled = {car.status === 'unavailable'} className="mt-5 bg-secondary-color disabled:bg-gray-200 dark:disabled:bg-dark-light-primary py-3 w-full text-white">
            Book
          </button>
        </Form>
      </div>
      <LoadingModal title="Just a moment please.." isOpen={isLoading} />
    </div>
  );
};

export default BookingForm;
