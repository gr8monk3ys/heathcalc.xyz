'use client';

// Rule: Move localStorage logic to dedicated hooks/utilities for better separation of concerns

import { useSavedResults } from '@/context/SavedResultsContext';
import { useState } from 'react';
import { createLogger } from '@/utils/logger';
import { computeSavedResultKey } from '@/utils/savedResultsKey';

const logger = createLogger({ component: 'useSavedResultsManager' });

/**
 * Custom hook for managing saved calculator results
 * Provides functions to save, remove, and check saved results
 */
export function useSavedResultsManager() {
  const {
    savedResults,
    saveResult: saveResultToContext,
    removeResult: removeResultFromContext,
    clearAllResults,
    isResultSaved,
    canSaveResults,
  } = useSavedResults();

  const [message, setMessage] = useState<string>('');
  const [showMessage, setShowMessage] = useState<boolean>(false);

  /**
   * Save a calculator result
   * @param calculatorType Type of calculator (e.g., 'bmi', 'tdee')
   * @param calculatorName Human-readable name of calculator
   * @param data Result data to save
   * @returns True if saved successfully, false if already saved
   */
  function saveResult(
    calculatorType: string,
    calculatorName: string,
    data: Record<string, unknown>
  ): boolean {
    try {
      // Check if already saved
      const resultId = computeSavedResultKey(calculatorType, data);
      if (isResultSaved(resultId)) {
        showNotification('This result is already saved');
        return false;
      }

      // Save to context (which handles localStorage)
      const didSave = saveResultToContext(calculatorType, calculatorName, data);
      if (!didSave) {
        showNotification('Sign in required to save results');
        return false;
      }

      showNotification('Result saved successfully');
      return true;
    } catch (error) {
      logger.logError('Error saving result', error);
      showNotification('Error saving result');
      return false;
    }
  }

  /**
   * Remove a saved result
   * @param id Result ID to remove
   */
  function removeResult(id: string): void {
    try {
      removeResultFromContext(id);
      showNotification('Result removed');
    } catch (error) {
      logger.logError('Error removing result', error);
      showNotification('Error removing result');
    }
  }

  /**
   * Remove a saved result by calculator type and data
   * @param calculatorType Type of calculator
   * @param data Result data
   * @returns True if removed successfully
   */
  function removeResultByData(calculatorType: string, data: Record<string, unknown>): boolean {
    try {
      const resultId = computeSavedResultKey(calculatorType, data);
      if (!isResultSaved(resultId)) {
        return false;
      }

      removeResultFromContext(resultId);
      showNotification('Result removed');
      return true;
    } catch (error) {
      logger.logError('Error removing result', error);
      showNotification('Error removing result');
      return false;
    }
  }

  /**
   * Check if a result is saved
   * @param calculatorType Type of calculator
   * @param data Result data
   * @returns True if the result is saved
   */
  function isResultSavedByData(calculatorType: string, data: Record<string, unknown>): boolean {
    const resultId = computeSavedResultKey(calculatorType, data);
    return isResultSaved(resultId);
  }

  /**
   * Clear all saved results with confirmation
   * @returns True if cleared successfully
   */
  function clearAllResultsWithConfirmation(): boolean {
    if (window.confirm('Are you sure you want to clear all saved results?')) {
      clearAllResults();
      showNotification('All results cleared');
      return true;
    }
    return false;
  }

  /**
   * Format a date string
   * @param dateString ISO date string
   * @returns Formatted date string
   */
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  /**
   * Show a notification message
   * @param msg Message to show
   * @param duration Duration in milliseconds
   */
  function showNotification(msg: string, duration: number = 3000): void {
    setMessage(msg);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), duration);
  }

  return {
    savedResults,
    canSaveResults,
    saveResult,
    removeResult,
    removeResultByData,
    isResultSaved: isResultSavedByData,
    clearAllResults: clearAllResultsWithConfirmation,
    formatDate,
    message,
    showMessage,
    showNotification,
  };
}
