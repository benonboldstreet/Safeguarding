/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertTriangle, 
  ChevronRight, 
  RotateCcw, 
  Phone, 
  ExternalLink, 
  Info,
  CheckCircle2,
  HelpCircle,
  Printer,
  Search,
  ChevronDown,
  ArrowLeft,
  FileText,
  Code
} from 'lucide-react';
import { STEPS, CONTACTS, ABUSE_TYPES } from './constants';
import { StepId } from './types';

export default function App() {
  const [currentStepId, setCurrentStepId] = useState<StepId>('emergency');
  const [history, setHistory] = useState<StepId[]>([]);
  const [caseRef, setCaseRef] = useState('');
  const [showLongDesc, setShowLongDesc] = useState(false);
  const [abuseSearch, setAbuseSearch] = useState('');
  const [showEmbedCode, setShowEmbedCode] = useState(false);

  const currentStep = useMemo(() => STEPS[currentStepId], [currentStepId]);

  const handleNext = (nextId: StepId) => {
    setHistory([...history, currentStepId]);
    setCurrentStepId(nextId);
    setShowLongDesc(false);
  };

  const handleReset = () => {
    setCurrentStepId('emergency');
    setHistory([]);
    setCaseRef('');
    setShowLongDesc(false);
  };

  const handleBack = () => {
    if (history.length === 0) return;
    const newHistory = [...history];
    const prevId = newHistory.pop()!;
    setHistory(newHistory);
    setCurrentStepId(prevId);
    setShowLongDesc(false);
  };

  const isFinalStep = currentStepId === 'referral-needed' || 
                     currentStepId === 'no-referral-needed' || 
                     currentStepId === 'other-support';

  const filteredAbuseTypes = ABUSE_TYPES.filter(type => 
    type.toLowerCase().includes(abuseSearch.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white print:bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-20 print:hidden">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <span className="text-3xl font-black tracking-tighter flex">
                <span className="text-options-blue">O</span>
                <span className="text-options-orange">p</span>
                <span className="text-options-green">t</span>
                <span className="text-options-pink">i</span>
                <span className="text-options-light-blue">o</span>
                <span className="text-options-orange">n</span>
                <span className="text-options-blue">s</span>
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200 hidden sm:block" />
            <div className="hidden sm:block">
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-[0.2em]">
                Safeguarding Decision Tool
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={handleReset}
                className="p-2 text-slate-400 hover:text-options-blue hover:bg-slate-50 rounded-full transition-all"
                title="Reset Tool"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={handlePrint}
              className="p-2 text-slate-400 hover:text-options-blue hover:bg-slate-50 rounded-full transition-all"
              title="Print Summary"
            >
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Print-only Header */}
      <div className="hidden print:block p-8 border-b-2 border-slate-900 mb-8">
        <h1 className="text-3xl font-bold">Safeguarding Decision Summary</h1>
        <p className="text-slate-500">Options for Supported Living</p>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-bold">Date:</p>
            <p>{new Date().toLocaleDateString()}</p>
          </div>
          <div>
            <p className="font-bold">Case Reference:</p>
            <p>{caseRef || 'Not provided'}</p>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 md:py-16 print:p-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="space-y-12"
          >
            {/* Case Ref Input (Only on first step) */}
            {currentStepId === 'emergency' && (
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 print:hidden">
                <label className="block text-sm font-extrabold text-slate-500 uppercase tracking-widest mb-4">
                  Case Reference / Initials (Optional)
                </label>
                <input
                  type="text"
                  value={caseRef}
                  onChange={(e) => setCaseRef(e.target.value)}
                  placeholder="e.g. BS-123"
                  className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 focus:border-options-blue outline-none transition-all text-lg font-semibold"
                />
              </div>
            )}

            {/* Progress Bar */}
            {!isFinalStep && (
              <div className="flex gap-3 px-4 print:hidden">
                {Object.keys(STEPS).filter(k => !['referral-needed', 'no-referral-needed', 'other-support'].includes(k)).map((stepKey, idx, arr) => {
                  const stepIndex = arr.indexOf(currentStepId);
                  const isActive = idx === stepIndex;
                  const isCompleted = idx < stepIndex;
                  return (
                    <div
                      key={stepKey}
                      className={`h-3 flex-1 rounded-full transition-all duration-700 ${
                        isActive ? 'bg-options-blue scale-y-125 shadow-lg shadow-options-blue/20' : isCompleted ? 'bg-options-light-blue' : 'bg-slate-100'
                      }`}
                    />
                  );
                })}
              </div>
            )}

            {/* Main Card */}
            <div className="relative">
              {/* Decorative background element */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-options-yellow rounded-full opacity-20 blur-2xl -z-10" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-options-pink rounded-full opacity-10 blur-3xl -z-10" />

              <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden print:border-none print:shadow-none">
                <div className="p-10 md:p-16">
                  {currentStepId === 'emergency' && (
                    <div className="mb-10 inline-flex items-center gap-3 px-6 py-2 rounded-full bg-red-50 text-red-600 text-sm font-black border border-red-100 uppercase tracking-wider">
                      <AlertTriangle className="w-5 h-5" />
                      Immediate Risk Check
                    </div>
                  )}

                  <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 md:mb-8 leading-tight tracking-tight">
                    {currentStep?.question}
                  </h2>
                  
                  <div className="prose prose-slate max-w-none">
                    <p className="text-xl md:text-2xl text-slate-600 leading-relaxed mb-8 md:mb-12 font-medium">
                      {currentStep?.description}
                    </p>
                  </div>

                  {/* Long Description / Learn More */}
                  {currentStep?.longDescription && (
                    <div className="mb-12 print:block">
                      <button
                        onClick={() => setShowLongDesc(!showLongDesc)}
                        className="flex items-center gap-3 text-options-blue font-extrabold text-base hover:text-options-light-blue transition-colors print:hidden"
                      >
                        <div className="w-8 h-8 rounded-full bg-options-blue/10 flex items-center justify-center">
                          <Info className="w-4 h-4" />
                        </div>
                        {showLongDesc ? 'Hide detailed guidance' : 'Show detailed guidance'}
                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${showLongDesc ? 'rotate-180' : ''}`} />
                      </button>
                      {(showLongDesc || window.location.search.includes('print')) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="mt-6 p-8 bg-slate-50 rounded-[2rem] border border-slate-100 text-slate-700 text-lg leading-relaxed print:bg-white print:border-slate-200"
                        >
                          {currentStep.longDescription}
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Abuse Types Searchable List */}
                  {currentStepId === 'abuse-risk' && (
                    <div className="mb-12 space-y-6 print:block">
                      <div className="relative print:hidden">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search abuse types..."
                          value={abuseSearch}
                          onChange={(e) => setAbuseSearch(e.target.value)}
                          className="w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-options-blue outline-none transition-all text-lg"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar print:max-h-none print:grid-cols-1">
                        {filteredAbuseTypes.map((type, idx) => (
                          <div key={idx} className="p-5 bg-white border-2 border-slate-50 rounded-2xl flex items-center gap-4 hover:border-options-light-blue/30 transition-all group">
                            <div className="w-3 h-3 rounded-full bg-options-green group-hover:scale-125 transition-transform" />
                            <span className="text-lg text-slate-700 font-bold">{type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Options Grid */}
                  {!isFinalStep && (
                    <div className="grid gap-6 print:hidden">
                      {currentStep?.options.map((option, idx) => {
                        const getVariantStyles = () => {
                          if (option.variant === 'danger') return 'border-red-100 bg-red-50 hover:border-red-500 hover:bg-red-100 text-red-900';
                          if (idx === 0) return 'border-options-blue/10 bg-options-blue/5 hover:border-options-blue hover:bg-options-blue hover:text-white text-options-blue';
                          if (idx === 1) return 'border-options-orange/10 bg-options-orange/5 hover:border-options-orange hover:bg-options-orange hover:text-white text-options-orange';
                          return 'border-slate-100 bg-slate-50 hover:border-slate-300 text-slate-700';
                        };

                        return (
                          <button
                            key={idx}
                            onClick={() => handleNext(option.nextStepId)}
                            className={`
                              group flex items-center justify-between p-6 md:p-8 rounded-2xl md:rounded-[2rem] border-2 md:border-4 transition-all duration-300 text-left
                              ${getVariantStyles()}
                            `}
                          >
                            <span className="font-black text-xl md:text-3xl">{option.label}</span>
                            <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-300 ${
                              option.variant === 'danger' 
                                ? 'bg-red-500 text-white' 
                                : 'bg-white/50 group-hover:bg-white group-hover:scale-110'
                            }`}>
                              <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Final Outcomes */}
                  {isFinalStep && (
                    <div className="space-y-12">
                      <div className={`p-10 rounded-[3rem] border-4 flex flex-col md:flex-row gap-8 items-center text-center md:text-left ${
                        currentStepId === 'referral-needed' 
                          ? 'bg-options-green/10 border-options-green' 
                          : 'bg-slate-50 border-slate-200'
                      }`}>
                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 shadow-xl ${
                          currentStepId === 'referral-needed' ? 'bg-options-green text-white' : 'bg-slate-500 text-white'
                        }`}>
                          {currentStepId === 'referral-needed' ? (
                            <CheckCircle2 className="w-10 h-10" />
                          ) : (
                            <Info className="w-10 h-10" />
                          )}
                        </div>
                        <div>
                          <h3 className={`text-3xl font-black mb-3 ${
                            currentStepId === 'referral-needed' ? 'text-options-green' : 'text-slate-900'
                          }`}>
                            {currentStep?.question}
                          </h3>
                          <p className={`text-xl font-bold ${currentStepId === 'referral-needed' ? 'text-slate-700' : 'text-slate-600'}`}>
                            {currentStep?.description}
                          </p>
                        </div>
                      </div>

                      {currentStepId === 'referral-needed' && (
                        <div className="space-y-10">
                          <div className="grid gap-6">
                            <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                              <div className="w-2 h-8 bg-options-blue rounded-full" />
                              Required Actions:
                            </h4>
                            <div className="grid gap-4">
                              {[
                                'Ensure immediate safety of the individual.',
                                'Document all observations and conversations clearly.',
                                'Report via the Liverpool Professional Portal.',
                                'Inform your line manager immediately.'
                              ].map((action, i) => (
                                <div key={i} className="flex gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 items-center">
                                  <div className="w-10 h-10 rounded-full bg-options-blue text-white flex items-center justify-center text-lg font-black shrink-0">
                                    {i + 1}
                                  </div>
                                  <p className="text-lg text-slate-700 font-bold">{action}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-6 print:hidden">
                            <a 
                              href={CONTACTS.ONLINE_PORTAL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center gap-4 py-6 bg-options-blue hover:bg-options-light-blue text-white font-black text-xl rounded-[2rem] transition-all shadow-2xl shadow-options-blue/30"
                            >
                              Report Online
                              <ExternalLink className="w-6 h-6" />
                            </a>
                            <button
                              onClick={handleReset}
                              className="flex-1 py-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xl rounded-[2rem] transition-all"
                            >
                              Start Over
                            </button>
                          </div>
                        </div>
                      )}

                      {(currentStepId === 'no-referral-needed' || currentStepId === 'other-support') && (
                        <div className="space-y-10">
                          <div className="p-10 bg-options-blue/5 border-2 border-options-blue/10 rounded-[3rem]">
                            <h4 className="text-2xl font-black text-options-blue mb-6">Next Steps:</h4>
                            <ul className="space-y-4">
                              {[
                                'Internal incident reporting procedures.',
                                'Reviewing the individual\'s support plan.',
                                'Providing advice or signposting to other services.',
                                'Monitoring the situation closely.'
                              ].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 text-lg font-bold text-slate-700">
                                  <div className="w-2 h-2 rounded-full bg-options-orange" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <button
                            onClick={handleReset}
                            className="w-full py-6 bg-options-blue hover:bg-options-light-blue text-white font-black text-xl rounded-[2rem] transition-all print:hidden"
                          >
                            Start New Assessment
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Back Button */}
            {history.length > 0 && !isFinalStep && (
              <button
                onClick={handleBack}
                className="group flex items-center gap-3 text-slate-400 hover:text-options-blue font-black text-lg transition-all px-8 print:hidden"
              >
                <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-2" />
                Back to previous question
              </button>
            )}

            {/* Contact Footer */}
            <div className="bg-options-blue rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-20 text-white relative overflow-hidden print:hidden">
              <div className="relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div>
                  <h3 className="text-3xl md:text-4xl font-black mb-6 flex items-center gap-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                      <Phone className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                    Options On-Call
                  </h3>
                  <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-10 font-medium">
                    Your first port of call for any safeguarding issues at Options is our dedicated on-call team.
                  </p>
                  <div className="flex flex-wrap gap-4 md:gap-6">
                    <div className="flex-1 min-w-[200px] px-8 py-5 bg-white/10 rounded-3xl backdrop-blur-xl border border-white/20">
                      <p className="text-xs font-black uppercase tracking-widest text-options-yellow mb-2">Options On-Call</p>
                      <p className="text-2xl md:text-3xl font-black">{CONTACTS.OPTIONS_ON_CALL}</p>
                    </div>
                    <div className="flex-1 min-w-[200px] px-8 py-5 bg-white/10 rounded-3xl backdrop-blur-xl border border-white/20">
                      <p className="text-xs font-black uppercase tracking-widest text-options-light-blue mb-2">Liverpool Careline</p>
                      <p className="text-2xl md:text-3xl font-black">{CONTACTS.LIVERPOOL_CARELINE}</p>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="p-10 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-sm">
                    <h4 className="text-xl font-black mb-4 flex items-center gap-3 text-options-yellow">
                      <Info className="w-6 h-6" />
                      Important Guidance
                    </h4>
                    <p className="text-lg text-white/70 font-medium leading-relaxed">
                      Always contact the Options on-call number first. Liverpool Careline is provided as an additional resource for broader safeguarding concerns.
                    </p>
                  </div>
                </div>
              </div>
              {/* Abstract decorative circles */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-options-orange rounded-full opacity-20 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-options-green rounded-full opacity-20 blur-3xl" />
            </div>

            {/* Embed Code Guide */}
            <div className="mt-16 pt-16 border-t border-slate-100 print:hidden">
              <button
                onClick={() => setShowEmbedCode(!showEmbedCode)}
                className="flex items-center gap-3 text-slate-400 hover:text-options-blue font-black text-sm mx-auto transition-colors"
              >
                <Code className="w-5 h-5" />
                {showEmbedCode ? 'Hide Embed Instructions' : 'How to add this to your website'}
              </button>
              
              {showEmbedCode && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-10 bg-slate-900 rounded-[3rem] text-slate-300"
                >
                  <h4 className="text-2xl text-white font-black mb-6">Embed this tool on your website</h4>
                  <p className="text-lg mb-8 leading-relaxed font-medium">
                    Copy and paste the code below into any HTML page or CMS (WordPress, etc.) to embed this decision tree.
                  </p>
                  <div className="bg-black/50 p-6 rounded-2xl font-mono text-sm text-options-light-blue overflow-x-auto border border-white/10 mb-8">
                    {`<iframe 
  src="${window.location.href}" 
  width="100%" 
  height="900px" 
  style="border:none; border-radius: 40px; box-shadow: 0 20px 50px rgba(0,0,0,0.1);"
  title="Safeguarding Decision Tool">
</iframe>`}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6 text-sm">
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-white font-black mb-2 uppercase tracking-wider text-xs">Responsive</p>
                      The tool automatically adjusts for mobile and desktop screens.
                    </div>
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-white font-black mb-2 uppercase tracking-wider text-xs">Secure</p>
                      No data is stored or sent to external servers.
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-white border-t border-slate-50 py-12 print:hidden">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <p className="text-slate-400 text-sm font-bold">
              © {new Date().getFullYear()} Options for Supported Living.
            </p>
            <p className="text-slate-300 text-xs mt-1">
              Registered Charity No. 1042742
            </p>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-slate-400 hover:text-options-blue text-sm font-black transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-400 hover:text-options-blue text-sm font-black transition-colors">Terms of Use</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
