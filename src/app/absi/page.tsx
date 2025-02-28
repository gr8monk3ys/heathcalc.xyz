'use client';

import React, { useState } from 'react';
import { Gender, HeightUnit, WeightUnit } from '@/types/common';
import { ABSIResult as ABSIResultType } from '@/types/absi';
import { calculateABSIMetrics } from '@/app/api/absi';
import CalculatorForm from '@/components/calculators/CalculatorForm';
import ABSIResultDisplay from '@/components/calculators/absi/ABSIResult';
import ABSIInfo from '@/components/calculators/absi/ABSIInfo';
import ABSIUnderstanding from '@/components/calculators/absi/ABSIUnderstanding';

export default function ABSICalculator() {
  // State for form inputs
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [heightUnit, setHeightUnit] = useState<HeightUnit>('cm');
  const [weight, setWeight] = useState<number | ''>('');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [waist, setWaist] = useState<number | ''>('');
  
  // State for form validation
  const [errors, setErrors] = useState<{
    age?: string;
    height?: string;
    weight?: string;
    waist?: string;
  }>({});
  
  // State for calculation result
  const [result, setResult] = useState<ABSIResultType | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: {
      age?: string;
      height?: string;
      weight?: string;
      waist?: string;
    } = {};
    
    if (age === '') {
      newErrors.age = 'Age is required';
    } else if (typeof age === 'number' && (age < 18 || age > 80)) {
      newErrors.age = 'Age must be between 18 and 80';
    }
    
    if (height === '') {
      newErrors.height = 'Height is required';
    } else if (typeof height === 'number') {
      if (heightUnit === 'cm' && (height < 130 || height > 230)) {
        newErrors.height = 'Height must be between 130 and 230 cm';
      } else if (heightUnit === 'ft' && (height < 4 || height > 7.5)) {
        newErrors.height = 'Height must be between 4 and 7.5 feet';
      }
    }
    
    if (weight === '') {
      newErrors.weight = 'Weight is required';
    } else if (typeof weight === 'number') {
      if (weightUnit === 'kg' && (weight < 40 || weight > 200)) {
        newErrors.weight = 'Weight must be between 40 and 200 kg';
      } else if (weightUnit === 'lb' && (weight < 88 || weight > 440)) {
        newErrors.weight = 'Weight must be between 88 and 440 lb';
      }
    }
    
    if (waist === '') {
      newErrors.waist = 'Waist measurement is required';
    } else if (typeof waist === 'number' && (waist < 50 || waist > 200)) {
      newErrors.waist = 'Waist must be between 50 and 200 cm';
    }
    
    setErrors(newErrors);
    
    // If no errors, calculate ABSI
    if (Object.keys(newErrors).length === 0 && 
        typeof age === 'number' && 
        typeof height === 'number' && 
        typeof weight === 'number' &&
        typeof waist === 'number') {
      
      // Convert height to cm if needed
      const heightCm = heightUnit === 'cm' ? height : height * 30.48;
      
      // Convert weight to kg if needed
      const weightKg = weightUnit === 'kg' ? weight : weight / 2.20462;
      
      try {
        // Calculate ABSI and related metrics
        const absiResult = calculateABSIMetrics(waist, heightCm, weightKg, age, gender);
        
        setResult(absiResult);
        setShowResult(true);
        
        // Scroll to result with smooth animation
        setTimeout(() => {
          const resultElement = document.getElementById('absi-result');
          if (resultElement) {
            resultElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } catch (error) {
        console.error('Error calculating ABSI:', error);
        // Handle error (could set an error state here)
      }
    }
  };
  
  // Handle unit toggle
  const toggleHeightUnit = () => {
    if (heightUnit === 'cm' && typeof height === 'number') {
      setHeight(parseFloat((height / 30.48).toFixed(1)));
      setHeightUnit('ft');
    } else if (heightUnit === 'ft' && typeof height === 'number') {
      setHeight(parseFloat((height * 30.48).toFixed(1)));
      setHeightUnit('cm');
    } else {
      setHeightUnit(heightUnit === 'cm' ? 'ft' : 'cm');
    }
  };
  
  const toggleWeightUnit = () => {
    if (weightUnit === 'kg' && typeof weight === 'number') {
      setWeight(parseFloat((weight * 2.20462).toFixed(1)));
      setWeightUnit('lb');
    } else if (weightUnit === 'lb' && typeof weight === 'number') {
      setWeight(parseFloat((weight / 2.20462).toFixed(1)));
      setWeightUnit('kg');
    } else {
      setWeightUnit(weightUnit === 'kg' ? 'lb' : 'kg');
    }
  };
  
  // Reset form
  const handleReset = () => {
    setGender('male');
    setAge('');
    setHeight('');
    setHeightUnit('cm');
    setWeight('');
    setWeightUnit('kg');
    setWaist('');
    setErrors({});
    setResult(null);
    setShowResult(false);
  };
  
  // Form fields for the CalculatorForm component
  const formFields = [
    {
      name: 'gender',
      label: 'Gender',
      type: 'radio' as const,
      value: gender,
      onChange: setGender,
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' }
      ]
    },
    {
      name: 'age',
      label: 'Age',
      type: 'number' as const,
      value: age,
      onChange: setAge,
      error: errors.age,
      placeholder: 'Years'
    },
    {
      name: 'height',
      label: 'Height',
      type: 'number' as const,
      value: height,
      onChange: setHeight,
      error: errors.height,
      placeholder: heightUnit === 'cm' ? 'Centimeters' : 'Feet',
      unit: heightUnit === 'cm' ? 'cm' : 'ft',
      unitToggle: toggleHeightUnit,
      step: '0.1'
    },
    {
      name: 'weight',
      label: 'Weight',
      type: 'number' as const,
      value: weight,
      onChange: setWeight,
      error: errors.weight,
      placeholder: weightUnit === 'kg' ? 'Kilograms' : 'Pounds',
      unit: weightUnit === 'kg' ? 'kg' : 'lb',
      unitToggle: toggleWeightUnit,
      step: '0.1'
    },
    {
      name: 'waist',
      label: 'Waist Circumference (cm)',
      type: 'number' as const,
      value: waist,
      onChange: setWaist,
      error: errors.waist,
      placeholder: 'Centimeters',
      step: '0.1'
    }
  ];
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">A Body Shape Index (ABSI) Calculator</h1>
      <p className="text-gray-600 mb-6">
        Calculate your ABSI to assess health risks related to body shape and fat distribution
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <CalculatorForm
            title="Enter Your Details"
            fields={formFields}
            onSubmit={handleSubmit}
            onReset={handleReset}
          />
        </div>
        
        <div className="md:col-span-2">
          {showResult && result ? (
            <ABSIResultDisplay result={result} />
          ) : (
            <ABSIInfo />
          )}
        </div>
      </div>
      
      <ABSIUnderstanding />
    </div>
  );
}
