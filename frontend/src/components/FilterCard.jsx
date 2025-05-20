import React, { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { Button } from './ui/button';
import { Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const filterData = [
    {
        filterType: "All Jobs",
        array: ["All Jobs"]
    },
    {
        filterType: "Location",
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
    },
    {
        filterType: "Industry",
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
    },
    {
        filterType: "Work Type",
        array: ["Remote", "Work From Home", "Hybrid", "Full-Time"] 
    },
    
];

const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('All Jobs'); // Default to "All Jobs"
    const dispatch = useDispatch();
   const navigate=useNavigate();
    const changeHandler = (value) => {
        setSelectedValue(value);
    };

    useEffect(() => {
        dispatch(setSearchedQuery(selectedValue === "All Jobs" ? "" : selectedValue));
    }, [selectedValue, dispatch]);

    return (
        <div className='w-full bg-white p-3 rounded-md'>
            <div className="w-full flex justify-start mb-4">
  <Button
    onClick={() => navigate('/saved')}
    className="bg-[#ffffff] hover:bg-[#dbd8dc] border border-black-200 text-black font-semibold rounded-xl"
  >
    <Bookmark className="h-4 w-4 mr-2" />
    Saved Jobs
  </Button>
</div>
            <h1 className='font-bold text-lg'>Filter Jobs</h1>
            <hr className='mt-3' />
            <RadioGroup value={selectedValue} onValueChange={changeHandler}>
                {filterData.map((data, index) => (
                    <div key={index}>
                        <h1 className='font-bold text-lg'>{data.filterType}</h1>
                        {data.array.map((item, idx) => {
                            const itemId = `id${index}-${idx}`;
                            return (
                                <div className='flex items-center space-x-2 my-2' key={idx}>
                                    <RadioGroupItem value={item} id={itemId} />
                                    <Label htmlFor={itemId}>{item}</Label>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </RadioGroup>
        </div>
    );
};

export default FilterCard;
