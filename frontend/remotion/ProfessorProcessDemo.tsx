import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export type ProfessorProcessDemoProps = {
	course: string;
	exam: string;
	scoresCsvPreview: string[];
	mappingCsvPreview: string[];
	alerts: string[];
	studyPlan: string[];
};

const bg = '#0b2345';
const card = '#13315f';
const cardMuted = '#1b3f75';
const accent = '#f7c948';
const text = '#f3f7ff';
const subtext = '#c8d6f0';

const SectionTitle: React.FC<{title: string; subtitle: string}> = ({title, subtitle}) => {
	return (
		<div style={{marginBottom: 30}}>
			<div style={{fontSize: 24, color: accent, letterSpacing: 3, fontWeight: 700}}>PREREQ DEMO</div>
			<div style={{fontSize: 64, color: text, fontWeight: 700, lineHeight: 1.1, marginTop: 14}}>{title}</div>
			<div style={{fontSize: 34, color: subtext, marginTop: 12}}>{subtitle}</div>
		</div>
	);
};

const Panel: React.FC<{title: string; children: React.ReactNode; width?: number | string}> = ({title, children, width = '100%'}) => {
	return (
		<div
			style={{
				width,
				backgroundColor: card,
				border: `3px solid ${accent}`,
				borderRadius: 16,
				padding: 24,
				boxShadow: '0 10px 32px rgba(0,0,0,0.25)',
			}}
		>
			<div style={{fontSize: 34, color: accent, fontWeight: 700, marginBottom: 18}}>{title}</div>
			<div style={{fontSize: 28, color: text, lineHeight: 1.45}}>{children}</div>
		</div>
	);
};

const CsvBlock: React.FC<{lines: string[]}> = ({lines}) => (
	<div
		style={{
			backgroundColor: '#0b1b34',
			borderRadius: 10,
			padding: 16,
			fontFamily: 'Menlo, Monaco, Consolas, monospace',
			fontSize: 22,
			lineHeight: 1.5,
			color: '#d7e4ff',
			border: '1px solid #3f5a86',
			whiteSpace: 'pre-wrap',
		}}
	>
		{lines.join('\n')}
	</div>
);

const ProgressBar: React.FC<{label: string; progress: number}> = ({label, progress}) => (
	<div style={{marginTop: 16}}>
		<div style={{fontSize: 24, color: subtext, marginBottom: 8}}>{label}</div>
		<div style={{height: 20, backgroundColor: '#102747', borderRadius: 999, overflow: 'hidden'}}>
			<div
				style={{
					height: '100%',
					width: `${Math.max(0, Math.min(100, progress * 100))}%`,
					background: 'linear-gradient(90deg, #4ea5ff 0%, #62d39f 100%)',
				}}
			/>
		</div>
	</div>
);

const Row: React.FC<{children: React.ReactNode}> = ({children}) => (
	<div style={{display: 'flex', gap: 26, alignItems: 'stretch', width: '100%'}}>{children}</div>
);

const BulletList: React.FC<{items: string[]}> = ({items}) => (
	<div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
		{items.map((item, idx) => (
			<div key={item} style={{display: 'flex', alignItems: 'flex-start', gap: 12}}>
				<div style={{color: accent, fontSize: 30, lineHeight: '34px'}}>{idx + 1}.</div>
				<div style={{fontSize: 27, color: text, lineHeight: 1.35}}>{item}</div>
			</div>
		))}
	</div>
);

const ShellLayout: React.FC<{children: React.ReactNode}> = ({children}) => (
	<AbsoluteFill style={{backgroundColor: bg, fontFamily: 'Inter, Arial, sans-serif', padding: 56}}>
		{children}
		<div
			style={{
				position: 'absolute',
				bottom: 28,
				left: 56,
				right: 56,
				fontSize: 24,
				color: accent,
				letterSpacing: 1.2,
				textAlign: 'center',
				padding: '10px 18px',
				border: `1px solid ${accent}`,
				borderRadius: 10,
				backgroundColor: 'rgba(247,201,72,0.08)',
			}}
		>
			PROFESSOR WORKFLOW: Upload -&gt; Configure -&gt; Compute -&gt; Diagnose -&gt; Personalize
		</div>
	</AbsoluteFill>
);

export const ProfessorProcessDemo: React.FC<ProfessorProcessDemoProps> = ({
	course,
	exam,
	scoresCsvPreview,
	mappingCsvPreview,
	alerts,
	studyPlan,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const entry = spring({
		frame,
		fps,
		config: {damping: 200},
		durationInFrames: 24,
	});
	const entryOpacity = interpolate(entry, [0, 1], [0, 1]);
	const entryY = interpolate(entry, [0, 1], [36, 0]);

	const computeProgress = interpolate(frame, [600, 820], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<ShellLayout>
			<div style={{opacity: entryOpacity, transform: `translateY(${entryY}px)`}}>
				<Sequence from={0} durationInFrames={300}>
					<div>
						<SectionTitle
							title="What professors see first"
							subtitle="One-click launch into exam intelligence"
						/>
						<Row>
							<Panel title="Course Context">
								<div style={{fontSize: 30, marginBottom: 10}}>Course: {course}</div>
								<div style={{fontSize: 30}}>Exam: {exam}</div>
							</Panel>
							<Panel title="Value in 3 Outcomes">
								<BulletList
									items={[
										'Concept readiness maps by prerequisite dependency',
										'Root-cause tracing for observed score drops',
										'Student-level study plans with explainable rationale',
									]}
								/>
							</Panel>
						</Row>
					</div>
				</Sequence>

				<Sequence from={300} durationInFrames={320}>
					<div>
						<SectionTitle
							title="Step 1-2: Upload Exam Data"
							subtitle="Scores + concept mapping are validated and attached to the exam"
						/>
						<Row>
							<Panel title="Scores CSV Preview" width="50%">
								<CsvBlock lines={scoresCsvPreview} />
							</Panel>
							<Panel title="Question-Concept Mapping CSV" width="50%">
								<CsvBlock lines={mappingCsvPreview} />
							</Panel>
						</Row>
					</div>
				</Sequence>

				<Sequence from={620} durationInFrames={300}>
					<div>
						<SectionTitle
							title="Step 3-4: Configure and Compute"
							subtitle="System calibrates inference parameters and computes mastery graph"
						/>
						<Row>
							<Panel title="Inference Parameters" width="46%">
								<div>alpha: 0.58</div>
								<div>beta: 0.27</div>
								<div>gamma: 0.15</div>
								<div>threshold: 0.62</div>
								<div>k: 4</div>
							</Panel>
							<Panel title="Computation Status" width="54%">
								<ProgressBar label="Dependency graph generation" progress={computeProgress * 0.85} />
								<ProgressBar label="Readiness score estimation" progress={computeProgress} />
								<ProgressBar label="Alert extraction" progress={Math.max(0, (computeProgress - 0.12) / 0.88)} />
								<div style={{marginTop: 20, color: accent, fontSize: 24}}>
									{computeProgress < 1 ? 'Compute running...' : 'Compute complete. Dashboard is ready.'}
								</div>
							</Panel>
						</Row>
					</div>
				</Sequence>

				<Sequence from={920} durationInFrames={300}>
					<div>
						<SectionTitle
							title="Instructor Dashboard Insight"
							subtitle="Root-cause alerts prioritize what to reteach first"
						/>
						<Row>
							<Panel title="High-Priority Alerts" width="56%">
								<BulletList items={alerts} />
							</Panel>
							<Panel title="Readiness Snapshot" width="44%">
								<div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
									<div>Arrays: 74%</div>
									<div>Recursion: 49%</div>
									<div>Trees: 53%</div>
									<div>Graphs: 45%</div>
									<div>Dynamic Programming: 39%</div>
								</div>
								<div style={{marginTop: 20, fontSize: 24, color: subtext}}>
									Recursion is the dominant prerequisite bottleneck.
								</div>
							</Panel>
						</Row>
					</div>
				</Sequence>

				<Sequence from={1220} durationInFrames={280}>
					<div>
						<SectionTitle
							title="Student-Level Personalization"
							subtitle="Explainable intervention plan generated from concept dependency gaps"
						/>
						<Row>
							<Panel title="Student: S-1002" width="46%">
								<div style={{fontSize: 27}}>Risk Level: Elevated</div>
								<div style={{fontSize: 27}}>Primary Gap: Recursion base cases</div>
								<div style={{fontSize: 27}}>Secondary Impact: Trees, Graphs</div>
							</Panel>
							<Panel title="Recommended Study Plan" width="54%">
								<BulletList items={studyPlan} />
							</Panel>
						</Row>
					</div>
				</Sequence>
			</div>
		</ShellLayout>
	);
};
