import React, { useState, useEffect, useCallback } from 'react';
import { suggestTopicsForAiMode, generateBlogPost, generateImages } from './services/geminiService';
import { GenerationState } from './types';
import type { GeneratedPost } from './types';
import { 
    PencilSquareIcon, GoogleGeminiIcon, CogIcon, SparklesIcon, YoutubeIcon, ShortsIcon, ThreadsIcon, EnIcon, JpIcon, EsIcon, CopyIcon, CheckIcon,
    CloseIcon, KeyIcon, ExternalLinkIcon, LightbulbIcon
} from './components/Icons';

// --- Reusable Components ---
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-200 ${className}`}>
        {children}
    </div>
);

const SectionTitle: React.FC<{ icon?: React.ReactNode; title: string; action?: React.ReactNode }> = ({ icon, title, action }) => (
    <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
            {icon}
            <h3 className="font-bold text-lg text-gray-700">{title}</h3>
        </div>
        {action}
    </div>
);

const FullScreenLoader: React.FC<{ state: GenerationState }> = ({ state }) => {
    const messages: { [key in GenerationState]?: string } = {
        [GenerationState.SUGGESTING_TITLES]: 'AI가 최신 트렌드를 분석하여 주제를 추천 중입니다...',
        [GenerationState.GENERATING_TEXT]: 'AI가 블로그 본문을 작성하고 있습니다...',
        [GenerationState.GENERATING_IMAGES]: '본문에 어울리는 이미지를 생성하고 있습니다...',
    };
    const message = messages[state] || 'AI가 작업 중입니다...';

    return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-green"></div>
            <p className="mt-4 text-lg font-semibold text-gray-700">{message}</p>
        </div>
    );
};


const SettingsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    currentApiKey: string | null;
    onSaveApiKey: (key: string) => void;
}> = ({ isOpen, onClose, currentApiKey, onSaveApiKey }) => {
    const [localApiKey, setLocalApiKey] = useState(currentApiKey || '');

    useEffect(() => {
        setLocalApiKey(currentApiKey || '');
    }, [currentApiKey, isOpen]);

    const handleSave = () => {
        if (localApiKey.trim()) {
            onSaveApiKey(localApiKey);
            onClose();
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300" onClick={onClose}>
            <div className="bg-gray-800 text-white rounded-2xl shadow-2xl w-full max-w-4xl m-4 transform transition-all duration-300 flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold">AI 모델 설정</h2>
                        <p className="text-sm text-gray-400">사용할 AI 모델과 API 키를 설정하세요.</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <CloseIcon />
                    </button>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Panel */}
                    <div className="space-y-6">
                        <h3 className="text-base font-semibold text-gray-300">AI 모델 선택</h3>
                        <div className="space-y-3">
                            {/* Google Gemini */}
                            <div className="p-4 border-2 border-blue-500 rounded-lg bg-blue-500/10 cursor-pointer flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">Google Gemini</p>
                                    <p className="text-sm text-gray-400">Google의 최신 AI 모델로 한국어 지원이 우수합니다.</p>
                                </div>
                                <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-gray-800 ring-2 ring-blue-500"></div>
                            </div>
                            {/* OpenAI GPT (Disabled) */}
                            <div className="p-4 border border-gray-600 rounded-lg cursor-not-allowed opacity-50 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">OpenAI GPT</p>
                                    <p className="text-sm text-gray-400">OpenAI의 강력한 GPT 모델들입니다.</p>
                                </div>
                                <div className="w-5 h-5 rounded-full border-2 border-gray-500"></div>
                            </div>
                            {/* Anthropic Claude (Disabled) */}
                             <div className="p-4 border border-gray-600 rounded-lg cursor-not-allowed opacity-50 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">Anthropic Claude</p>
                                    <p className="text-sm text-gray-400">Anthropic의 Claude 모델로 정확하고 안전한 응답을 제공합니다.</p>
                                </div>
                                <div className="w-5 h-5 rounded-full border-2 border-gray-500"></div>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-300 mb-2 block">세부 모델</label>
                            <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option>gemini-2.5-flash</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-300 mb-2 block">Gemini API Key</label>
                            <div className="flex gap-2">
                                <input 
                                    type="password" 
                                    value={localApiKey}
                                    onChange={(e) => setLocalApiKey(e.target.value)}
                                    placeholder="API 키를 여기에 붙여넣으세요"
                                    className="flex-grow bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm bg-gray-600 px-3 py-2 rounded-lg hover:bg-gray-500 whitespace-nowrap">
                                    <KeyIcon className="w-4 h-4" />
                                    API 키 발급받기
                                </a>
                            </div>
                        </div>
                    </div>
                    {/* Right Panel */}
                    <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                        <h3 className="font-semibold text-gray-200 mb-3 flex items-center gap-2"><KeyIcon className="w-5 h-5" />API 키 발급 가이드</h3>
                        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-500 transition-colors">
                            <ExternalLinkIcon />
                            Google Gemini API 키 발급 페이지 열기
                        </a>
                        <div className="mt-4 bg-yellow-900/50 border border-yellow-700 text-yellow-300 text-sm p-3 rounded-lg flex gap-3">
                            <LightbulbIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <p>
                                <span className="font-bold">팁:</span> API 키는 브라우저에만 저장되며 외부로 전송되지 않습니다. 하지만 보안을 위해 주기적으로 키를 재생성하는 것을 권장합니다.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-gray-900/50 border-t border-gray-700 flex justify-end">
                    <button 
                        onClick={handleSave} 
                        disabled={!localApiKey.trim()}
                        className="bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        저장하고 시작하기
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Main App Components ---

const Header: React.FC<{ onSettingsClick: () => void }> = ({ onSettingsClick }) => (
    <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
            <div className="bg-brand-green p-3 rounded-full">
                <PencilSquareIcon className="w-8 h-8 text-white" />
            </div>
            <div>
                <h1 className="text-2xl font-black text-gray-800">블로그 글쓰기 AI 도우미</h1>
                <p className="text-gray-500">다양한 AI 모델로 SEO에 최적화된 블로그 글을 손쉽게 작성하세요</p>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
                <GoogleGeminiIcon className="w-5 h-5" />
                <span className="font-semibold text-gray-600">Google Gemini</span>
            </div>
            <button onClick={onSettingsClick} className="flex items-center gap-2 text-sm font-semibold text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50">
                <CogIcon className="w-5 h-5" />
                <span>설정</span>
            </button>
        </div>
    </header>
);

const LeftPanel: React.FC<{
    onGenerate: (topic: string, category: string, region: string, targetAudience: string) => void;
    onSuggestTopics: (category: string) => Promise<string[]>;
    isApiKeySet: boolean;
}> = ({ onGenerate, onSuggestTopics, isApiKeySet }) => {
    const [topic, setTopic] = useState('');
    const [category, setCategory] = useState('건강/웰빙 (운동, 식단, 정신건강)');
    const [region, setRegion] = useState('국내');
    const [targetAudience, setTargetAudience] = useState('직장인,청년층');
    const [suggestedTopics, setSuggestedTopics] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const categories = ["모든 분야 최신 트렌드", "생활 (꿀팁, 취미 등)", "경제/금융 (투자, 재테크, 부동산)", "건강/웰빙 (운동, 식단, 정신건강)", "요리/맛집", "여행 (국내/해외)", "IT/기술 (AI, 최신 기술, 앱)", "사회 최신 트렌드/이슈", "K-문화/콘텐츠 (드라마, 영화, 음악)", "도서/문화생활", "교육/학습 (자기계발, 외국어)", "사회/정치 이슈", "뷰티/패션", "비즈니스/커리어 (창업, 직장생활)"];

    const handleSuggestTopics = async () => {
        if (!isApiKeySet) {
            setError('API 키를 먼저 설정해주세요.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const topics = await onSuggestTopics(category);
            setSuggestedTopics(topics);
        } catch (err) {
            setError('주제 추천 중 오류가 발생했습니다. API 키를 확인해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateClick = () => {
        if (!isApiKeySet) {
            setError('API 키를 먼저 설정해주세요.');
            return;
        }
        if (!topic.trim()) {
            setError('글 주제를 입력해주세요.');
            return;
        }
        setError('');
        onGenerate(topic, category, region, targetAudience);
    };

    const commonButtonStyles = "w-full text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

    return (
        <div className="space-y-6">
            <Card>
                <SectionTitle title="블로그 기본 정보" action={<button onClick={() => setTopic('')} className="text-sm font-semibold text-gray-500 hover:text-black">새 글</button>} />
                <p className="text-sm text-gray-600">AI가 이 정보를 바탕으로 글을 작성하고 제안합니다</p>
            </Card>

            <Card>
                <SectionTitle icon={<SparklesIcon />} title="AI 글 주제 추천받기" />
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-600 mb-1 block">지역 *</label>
                        <select value={region} onChange={e => setRegion(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green">
                            <option>국내</option>
                            <option>국외</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-600 mb-1 block">카테고리 *</label>
                        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green">
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
                <button onClick={handleSuggestTopics} disabled={isLoading || !isApiKeySet} className={`${commonButtonStyles} bg-brand-green hover:bg-brand-green-dark`}>
                    {isLoading ? '추천 중...' : '최신 SEO 트렌드 주제 추천받기'}
                </button>
                {suggestedTopics.length > 0 && (
                    <div className="mt-4">
                        <h4 className="font-semibold mb-2">추천 주제:</h4>
                        <ul className="space-y-2">
                            {suggestedTopics.slice(0, 5).map((t, i) => (
                                <li key={i} onClick={() => setTopic(t)} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer text-sm text-gray-700 transition-colors">{t}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </Card>

            <Card>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">글 주제 *</label>
                <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="꿀잠은 기본! 바쁜 한국인을 위한 숙면 & 멘탈 케어 솔루션 5가지" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"/>
                <p className="text-xs text-gray-500 mt-1">블로그 게시물의 핵심 주제를 입력해주세요. 주제 입력 후 AI 글쓰기를 추천받을 수 있습니다.</p>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </Card>
            
            <Card>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">타겟 독자 *</label>
                <input type="text" value={targetAudience} onChange={e => setTargetAudience(e.target.value)} placeholder="직장인, 20-30대, 건강에 관심 많은 사람" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"/>
            </Card>

            <button onClick={handleGenerateClick} disabled={!isApiKeySet} className={`${commonButtonStyles} bg-gray-800 hover:bg-black text-lg`}>
                <SparklesIcon className="inline-block mr-2" />
                프롬프트 검토 및 AI 글 생성
            </button>
        </div>
    );
};


const RightPanel: React.FC<{ post: GeneratedPost | null; generationState: GenerationState }> = ({ post, generationState }) => {
    const [activeTab, setActiveTab] = useState('HTML');
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        if (!post) return;
        
        const cardStyle = `max-width: 800px; margin: 2rem auto; background-color: #ffffff; border-radius: 16px; padding: 2rem; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); border: 1px solid #e5e7eb; font-family: 'Noto Sans KR', sans-serif;`;
        const h1Style = `font-size: 2.25rem; font-weight: 900; color: #111827; margin-bottom: 1.5rem; line-height: 1.2;`;
        const pStyle = `font-size: 1.125rem; color: #374151; line-height: 1.8; margin-bottom: 1.5rem;`;
        const h2Style = `font-size: 1.875rem; font-weight: 700; color: #1f2937; margin-top: 3rem; margin-bottom: 1rem; border-bottom: 2px solid #20c997; padding-bottom: 0.5rem;`;
        const h3Style = `font-size: 1.5rem; font-weight: 700; color: #1f2937; margin-top: 2.5rem; margin-bottom: 1rem;`;
        
        const accordionStyles = `
            .faq-container { margin-top: 3rem; }
            .faq-item { border-bottom: 1px solid #e5e7eb; }
            .faq-item input[type='checkbox'] { display: none; }
            .faq-item label { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 0; font-size: 1.25rem; font-weight: 700; color: #1f2937; cursor: pointer; }
            .faq-item label:hover { color: #20c997; }
            .faq-item .faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.3s ease-in-out; }
            .faq-item .faq-answer p { padding: 0 0 1.5rem 0; margin: 0; font-size: 1.125rem; color: #374151; line-height: 1.8; }
            .faq-item input[type='checkbox']:checked ~ .faq-answer { max-height: 500px; }
            .faq-item .icon::before { content: '+'; font-size: 1.5rem; color: #9ca3af; transition: transform 0.3s; }
            .faq-item input[type='checkbox']:checked ~ label .icon::before { transform: rotate(45deg); content: '+'; }
        `;
        
        const tagsContainerStyle = `margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb;`;
        const tagStyle = `display: inline-block; background-color: #f1f3f5; color: #4b5563; padding: 0.5rem 1rem; margin-right: 0.5rem; margin-bottom: 0.5rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 500; text-decoration: none;`;

        const qnaHtml = post.qna.map((item, index) => `
            <div class="faq-item">
                <input type="checkbox" id="faq-${index}" />
                <label for="faq-${index}">
                    ${item.question}
                    <span class="icon"></span>
                </label>
                <div class="faq-answer">
                    <p>${item.answer}</p>
                </div>
            </div>
        `).join('');

        const tagsHtml = post.tags.map(tag => `<a href="#" style="${tagStyle}">#${tag}</a>`).join(' ');

        const fullHtml = `
            <!DOCTYPE html>
            <html lang="ko">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${post.title}</title>
                <style>
                    body { font-family: 'Noto Sans KR', sans-serif; background-color: #f8f9fa; }
                    h1 { ${h1Style} } p { ${pStyle} } h2 { ${h2Style} } h3 { ${h3Style} }
                    ${accordionStyles}
                </style>
            </head>
            <body>
                <div style="${cardStyle}">
                    <h1>${post.title}</h1>
                    ${post.content}
                    <div class="faq-container">
                        <h2 style="${h2Style.replace('margin-top: 3rem;', 'margin-top: 0;')}">자주 묻는 질문 (Q&A)</h2>
                        ${qnaHtml}
                    </div>
                    <div style="${tagsContainerStyle}">
                        ${tagsHtml}
                    </div>
                </div>
            </body>
            </html>`;
        
        navigator.clipboard.writeText(fullHtml);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const ActionButton: React.FC<{ icon: React.ReactNode; text: string; className?: string }> = ({ icon, text, className }) => (
        <button disabled className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}>
            {icon}
            <span>{text}</span>
        </button>
    );

    return (
        <div className="space-y-6">
            <Card className="h-[450px] flex flex-col">
                <SectionTitle title="생성된 블로그 포스트" />
                <div className="flex border-b border-gray-200">
                    {['텍스트', '마크다운', 'HTML'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 font-semibold ${activeTab === tab ? 'border-b-2 border-brand-green text-brand-green' : 'text-gray-500'}`}>
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="flex-grow overflow-y-auto p-4 my-2 bg-gray-50 rounded-lg">
                    {generationState !== GenerationState.IDLE && generationState !== GenerationState.SUGGESTING_TITLES && <p className="text-gray-500">AI가 글을 생성하고 있습니다...</p>}
                    {!post && (generationState === GenerationState.IDLE || generationState === GenerationState.SUGGESTING_TITLES) && <p className="text-gray-500">AI 글 생성을 시작하면 결과가 여기에 표시됩니다.</p>}
                    {post && (
                        <div className="prose max-w-none">
                          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
                          <div dangerouslySetInnerHTML={{ __html: post.content }} />
                           <div className="mt-8">
                                <h2 className="text-xl font-bold border-b pb-2 mb-4">자주 묻는 질문 (Q&A)</h2>
                                {post.qna.map((item, index) => (
                                    <div key={index} className="mb-4">
                                        <h3 className="font-semibold">{item.question}</h3>
                                        <p>{item.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <button onClick={handleCopy} disabled={!post} className="w-full mt-auto bg-brand-green text-white font-bold py-3 rounded-lg hover:bg-brand-green-dark transition-colors disabled:opacity-50">
                   {isCopied ? <CheckIcon className="inline-block mr-2" /> : <CopyIcon className="inline-block mr-2" />}
                   {isCopied ? '복사 완료!' : `HTML로 변환 및 복사`}
                </button>
            </Card>

            <Card>
                <SectionTitle title="SNS 콘텐츠로 변환" />
                <div className="space-y-3">
                    <ActionButton icon={<YoutubeIcon />} text="유튜브 영상 스크립트 생성" className="bg-red-100 text-red-700" />
                    <ActionButton icon={<ShortsIcon />} text="유튜브 쇼츠 아이디어 (3가지)" className="bg-red-100 text-red-700" />
                    <ActionButton icon={<ThreadsIcon />} text="Threads 게시물 생성" className="bg-gray-200 text-gray-800" />
                </div>
            </Card>

            <Card>
                <SectionTitle title="블로그 포스트 번역" />
                <div className="grid grid-cols-3 gap-2">
                     <ActionButton icon={<EnIcon />} text="영어" className="bg-blue-100 text-blue-700" />
                     <ActionButton icon={<JpIcon />} text="일본어" className="bg-blue-100 text-blue-700" />
                     <ActionButton icon={<EsIcon />} text="스페인어" className="bg-blue-100 text-blue-700" />
                </div>
            </Card>
        </div>
    );
};


export default function App(): React.ReactNode {
    const [apiKey, setApiKey] = useState<string | null>(() => localStorage.getItem('gemini-api-key'));
    const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    
    const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null);
    const [generationState, setGenerationState] = useState<GenerationState>(GenerationState.IDLE);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!apiKey) {
            setIsSettingsModalOpen(true);
        }
    }, [apiKey]);
    
    const handleSaveApiKey = (key: string) => {
        setApiKey(key);
        localStorage.setItem('gemini-api-key', key);
    };

    const handleSuggestTopics = useCallback(async (category: string) => {
        if (!apiKey) throw new Error("API Key is not set.");
        setGenerationState(GenerationState.SUGGESTING_TITLES);
        try {
            return await suggestTopicsForAiMode(apiKey, selectedModel, category);
        } finally {
            setGenerationState(GenerationState.IDLE);
        }
    }, [apiKey, selectedModel]);


    const handleGeneratePost = useCallback(async (topic: string, category: string, region: string, targetAudience: string) => {
        if (!apiKey) {
            setError('API 키가 설정되지 않았습니다. 설정 메뉴를 확인해주세요.');
            return;
        }
        
        setError(null);
        setGeneratedPost(null);
        
        try {
            setGenerationState(GenerationState.GENERATING_TEXT);
            const payload = await generateBlogPost(apiKey, selectedModel, topic, category, region, targetAudience);

            setGenerationState(GenerationState.GENERATING_IMAGES);
            const imageUrls = await generateImages(apiKey, payload.imagePrompts);

            let finalHtml = payload.contentTemplate;
            imageUrls.forEach((url, index) => {
                const placeholder = `<!-- IMAGE_${index + 1} -->`;
                const imgTag = `<img src="${url}" alt="${payload.imagePrompts[index]}" style="display: block; margin: 2rem auto; max-width: 100%; height: auto; border-radius: 1rem;" />`;
                finalHtml = finalHtml.replace(placeholder, imgTag);
            });

            setGeneratedPost({ 
                title: payload.title, 
                content: finalHtml, 
                tags: payload.tags,
                qna: payload.qna
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '블로그 글 생성에 실패했습니다.';
            setError(`오류 발생: ${errorMessage}. API 키가 유효한지 확인해주세요.`);
        } finally {
            setGenerationState(GenerationState.IDLE);
        }
    }, [apiKey, selectedModel]);
    
    return (
        <div className="min-h-screen bg-brand-extralight p-4 sm:p-6 lg:p-8">
            {generationState !== GenerationState.IDLE && <FullScreenLoader state={generationState} />}
            
            <SettingsModal 
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
                currentApiKey={apiKey}
                onSaveApiKey={handleSaveApiKey}
            />

            <div className="max-w-screen-2xl mx-auto">
                <Header onSettingsClick={() => setIsSettingsModalOpen(true)} />
                <main className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3">
                       <LeftPanel 
                           onGenerate={handleGeneratePost} 
                           onSuggestTopics={handleSuggestTopics}
                           isApiKeySet={!!apiKey}
                       />
                    </div>
                    <div className="lg:col-span-2">
                        <RightPanel post={generatedPost} generationState={generationState} />
                    </div>
                </main>
                {error && (
                    <div 
                        className="fixed bottom-5 right-5 bg-red-600 text-white p-4 rounded-lg shadow-lg animate-pulse"
                        onClick={() => setError(null)}
                    >
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}