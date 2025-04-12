// ✅ START OF HealthQuiz.js

import React, { useState } from 'react';
import quizData from './quizData';

const HealthQuiz = () => {
  const totalQuestions = quizData.reduce((sum, section) => sum + section.questions.length, 0);
  const [answers, setAnswers] = useState(Array(totalQuestions).fill(null));
  const [currentSection, setCurrentSection] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const handleAnswer = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const calculateSectionScores = () => {
    let index = 0;
    const results = {};

    quizData.forEach(section => {
      const issueCount = section.questions.reduce((count, _, i) => {
        const answer = answers[index + i];
        return answer === true ? count + 1 : count; // Yes = problem
      }, 0);

      const total = section.questions.length;
      const score = ((total - issueCount) / total) * 100;

      results[section.key] = score;
      index += section.questions.length;
    });

    return results;
  };

  const calculateOverallScore = (scores) => {
    const total = Object.values(scores).reduce((sum, val) => sum + val, 0);
    return total / Object.values(scores).length;
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return "You’re in great shape! MOCEAN can support you in maintaining long-term health and longevity.";
    if (score >= 80) return "You're doing well — this is a great time to focus on optimizing your health and performance.";
    if (score >= 60) return "There are signs of imbalance. MOCEAN is recommended to help restore full-body health and resilience.";
    return "Your score shows significant imbalance. We highly recommend a full MOCEAN initial evaluation to uncover and resolve the root issues.";
  };

  const getModularRecommendations = (scores) => {
    const healthRecs = [];
    const optimizationRecs = [];
    const added = new Set();

    const descriptions = {
      "MOCEAN Therapy": "Restore balance across your body's systems through hands-on healing, movement, and energy alignment.",
      "Acupuncture": "Regulate your nervous system, improve digestion, sleep, and energy through modern acupuncture.",
      "Lymphatic Drainage": "Reduce inflammation, clear stagnation, and support detoxification using gentle technology-based therapy.",
      "Gut Reset": "Restore your microbiome and reduce chronic inflammation with a targeted gut healing protocol.",
      "Energy Optimization": "Boost stamina, reduce fatigue, and enhance vitality by restoring cellular energy systems.",
      "Circulation Optimization": "Boost blood and lymphatic flow to improve recovery, oxygenation, and tissue health.",
      "Gut Optimization": "Enhance digestion, reduce bloating, and support long-term gut health.",
      "Physical Optimization": "Rebuild movement, strength, and muscle recovery for daily resilience.",
      "Brain Optimization": "Sharpen focus and emotional clarity while reducing brain fog.",
      "Stress Optimization": "Support emotional balance, better sleep, and a healthy stress response.",
      "Cellular Optimization": "Promote healing, reduce inflammation, and restore energy at the cellular level.",
    };

    // MUSCULOSKELETAL
    if (scores.musculoskeletal <= 80) {
      if (!added.has("Physical Optimization")) {
        optimizationRecs.push({ title: "Physical Optimization", description: descriptions["Physical Optimization"] });
        added.add("Physical Optimization");
      }
    }
    if (scores.musculoskeletal <= 60) {
      if (!added.has("MOCEAN Therapy")) {
        healthRecs.push({ title: "MOCEAN Therapy", description: descriptions["MOCEAN Therapy"] });
        added.add("MOCEAN Therapy");
      }
    }

    // DIGESTIVE
    if (scores.digestive <= 80) {
      if (!added.has("Gut Optimization")) {
        optimizationRecs.push({ title: "Gut Optimization", description: descriptions["Gut Optimization"] });
        added.add("Gut Optimization");
      }
    }
    if (scores.digestive <= 60) {
      if (!added.has("Stress Optimization")) {
        optimizationRecs.push({ title: "Stress Optimization", description: descriptions["Stress Optimization"] });
        added.add("Stress Optimization");
      }
    }

    // CIRCULATORY
    if (scores.circulatory <= 80) {
      if (!added.has("Circulation Optimization")) {
        optimizationRecs.push({ title: "Circulation Optimization", description: descriptions["Circulation Optimization"] });
        added.add("Circulation Optimization");
      }
    }
    if (scores.circulatory <= 60) {
      if (!added.has("Lymphatic Drainage")) {
        healthRecs.push({ title: "Lymphatic Drainage", description: descriptions["Lymphatic Drainage"] });
        added.add("Lymphatic Drainage");
      }
    }

    // ENERGY
    if (scores.energy <= 80) {
      if (!added.has("Energy Optimization")) {
        optimizationRecs.push({ title: "Energy Optimization", description: descriptions["Energy Optimization"] });
        added.add("Energy Optimization");
      }
    }
    if (scores.energy <= 60) {
      if (!added.has("Acupuncture")) {
        healthRecs.push({ title: "Acupuncture", description: descriptions["Acupuncture"] });
        added.add("Acupuncture");
      }
      if (!added.has("Brain Optimization")) {
        optimizationRecs.push({ title: "Brain Optimization", description: descriptions["Brain Optimization"] });
        added.add("Brain Optimization");
      }
    }

    // DETOX
    if (scores.detox <= 80) {
      if (!added.has("Cellular Optimization")) {
        optimizationRecs.push({ title: "Cellular Optimization", description: descriptions["Cellular Optimization"] });
        added.add("Cellular Optimization");
      }
    }
    if (scores.detox <= 60) {
      if (!added.has("Gut Reset")) {
        healthRecs.push({ title: "Gut Reset", description: descriptions["Gut Reset"] });
        added.add("Gut Reset");
      }
    }

    return { healthRecs, optimizationRecs };
  };

  const handleNextSection = () => {
    const sectionStart = quizData.slice(0, currentSection).reduce((sum, sec) => sum + sec.questions.length, 0);
    const sectionEnd = sectionStart + quizData[currentSection].questions.length;
    const answeredAll = answers.slice(sectionStart, sectionEnd).every(a => a !== null);

    if (!answeredAll) {
      alert("Please answer all questions in this section before continuing.");
      return;
    }

    if (currentSection < quizData.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
      <h1>MOCEAN Health Quiz</h1>

      {showIntro ? (
  <>
    <h2>Is MOCEAN Right for You?</h2>
    <p>
      At MOCEAN, we take a whole-person approach to healing — integrating physical, emotional, and energetic systems to help you feel your best.
    </p>
    <p>
      This short quiz is designed to help you understand whether MOCEAN might be a good fit for your health goals and concerns.
      You'll answer a few questions about how you’ve been feeling lately — and we’ll share personalized insights and recommendations at the end.
    </p>
    <p style={{ fontStyle: 'italic', color: '#666' }}>
      <strong>Disclaimer:</strong> This quiz is not a medical diagnosis. It is a self-assessment tool meant to offer guidance and clarity.
      For a comprehensive evaluation and personalized plan of care, we recommend visiting MOCEAN for a full Initial Evaluation with our team.
    </p>
    <p style={{ marginTop: '1.5rem', fontWeight: 'bold' }}>
      The quiz takes less than 3 minutes. Let’s begin your journey to better balance and lasting wellness.
    </p>

    <button
      onClick={() => setShowIntro(false)}
      style={{
        marginTop: '1rem',
        padding: '12px 24px',
        fontSize: '1rem',
        backgroundColor: '#000',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}
    >
      Start the Quiz
    </button>
  </>
) : !submitted ? (
        <>
          <p>Section {currentSection + 1} of {quizData.length}</p>
          <h3>{quizData[currentSection].category}</h3>
          {quizData[currentSection].questions.map((question, qIdx) => {
            const globalIndex = quizData
              .slice(0, currentSection)
              .reduce((sum, sec) => sum + sec.questions.length, 0) + qIdx;

            return (
              <div key={globalIndex} style={{ marginBottom: '1rem' }}>
                <p>{question}</p>
                <button
                  onClick={() => handleAnswer(globalIndex, true)} // Yes = problem
                  style={{
                    marginRight: '10px',
                    border: answers[globalIndex] === true ? '2px solid black' : '1px solid #ccc',
                    backgroundColor: answers[globalIndex] === true ? '#f0f0f0' : 'white',
                    padding: '8px 16px',
                    cursor: 'pointer'
                  }}
                >
                  Yes
                </button>
                <button
                  onClick={() => handleAnswer(globalIndex, false)} // No = healthy
                  style={{
                    border: answers[globalIndex] === false ? '2px solid black' : '1px solid #ccc',
                    backgroundColor: answers[globalIndex] === false ? '#f0f0f0' : 'white',
                    padding: '8px 16px',
                    cursor: 'pointer'
                  }}
                >
                  No
                </button>
              </div>
            );
          })}

          <button onClick={handleNextSection} style={{ marginTop: '2rem' }}>
            {currentSection < quizData.length - 1 ? 'Next Section' : 'Submit My Results'}
          </button>
        </>
      ) : (
        <div>
          <h2>Your MOCEAN Wellness Insights</h2>
          {(() => {
            const sectionScores = calculateSectionScores();
            const overallScore = calculateOverallScore(sectionScores).toFixed(0);
            const personalizedMessage = getScoreMessage(overallScore);
            const { healthRecs, optimizationRecs } = getModularRecommendations(sectionScores);

            return (
              <>
                <p><strong>Your overall health score: {overallScore}%</strong></p>
                <p>{personalizedMessage}</p>

                {healthRecs.length > 0 && (
                  <>
                    <h3 style={{ marginTop: '2rem' }}>MOCEAN Health</h3>
                    <ul>
                      {healthRecs.map((rec, idx) => (
                        <li key={idx} style={{ marginBottom: '1rem' }}>
                          <strong>{rec.title}</strong> – {rec.description}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {optimizationRecs.length > 0 && (
                  <>
                    <h3 style={{ marginTop: '2rem' }}>MOCEAN Optimization</h3>
                    <ul>
                      {optimizationRecs.map((rec, idx) => (
                        <li key={idx} style={{ marginBottom: '1rem' }}>
                          <strong>{rec.title}</strong> – {rec.description}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            );
          })()}

          <p style={{ marginTop: '2rem' }}>
            Want to go deeper? Let’s connect for a personalized consultation.
          </p>
          <a
            href="https://calendly.com/YOUR-LINK"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#000',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: 'bold'
            }}
          >
            Book Your Consultation
          </a>

          <div style={{ marginTop: '2rem' }}>
            <button onClick={() => window.location.reload()}>
              Retake Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthQuiz;

// ✅ END OF HealthQuiz.js