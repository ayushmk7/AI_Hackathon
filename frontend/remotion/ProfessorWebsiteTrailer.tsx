import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	Sequence,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

const colors = {
	bg: '#071a36',
	card: '#102f5c',
	cardSoft: '#153a70',
	accent: '#ffcb05',
	text: '#f4f8ff',
	muted: '#c5d5f3',
	ok: '#60d394',
};

const badgeStyle: React.CSSProperties = {
	display: 'inline-block',
	padding: '8px 14px',
	borderRadius: 999,
	border: `1px solid ${colors.accent}`,
	color: colors.accent,
	fontSize: 18,
	letterSpacing: 1.4,
	fontWeight: 700,
};

const BrowserFrame: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => (
	<div
		style={{
			width: 1540,
			height: 820,
			backgroundColor: '#0a2548',
			borderRadius: 24,
			border: '1px solid rgba(255,255,255,0.15)',
			overflow: 'hidden',
			boxShadow: '0 28px 70px rgba(0,0,0,0.42)',
		}}
	>
		<div
			style={{
				height: 62,
				backgroundColor: '#133666',
				display: 'flex',
				alignItems: 'center',
				padding: '0 24px',
				gap: 12,
			}}
		>
			<div style={{width: 12, height: 12, borderRadius: 999, backgroundColor: '#ff6b6b'}} />
			<div style={{width: 12, height: 12, borderRadius: 999, backgroundColor: '#ffd166'}} />
			<div style={{width: 12, height: 12, borderRadius: 999, backgroundColor: '#63d471'}} />
			<div
				style={{
					marginLeft: 18,
					padding: '10px 16px',
					backgroundColor: '#0d2a53',
					borderRadius: 10,
					color: '#c5d7f4',
					fontSize: 18,
					border: '1px solid rgba(255,255,255,0.12)',
				}}
			>
				https://prereq.ai/professor
			</div>
			<div style={{marginLeft: 'auto', color: '#d7e4ff', fontSize: 18}}>{title}</div>
		</div>
		<div style={{padding: 24, height: 'calc(100% - 62px)'}}>{children}</div>
	</div>
);

const MetricCard: React.FC<{label: string; value: string; tone?: 'default' | 'ok'}> = ({
	label,
	value,
	tone = 'default',
}) => (
	<div
		style={{
			flex: 1,
			backgroundColor: colors.cardSoft,
			borderRadius: 14,
			border: '1px solid rgba(255,255,255,0.14)',
			padding: 18,
		}}
	>
		<div style={{fontSize: 16, color: colors.muted}}>{label}</div>
		<div
			style={{
				marginTop: 8,
				fontSize: 36,
				fontWeight: 700,
				color: tone === 'ok' ? colors.ok : colors.text,
			}}
		>
			{value}
		</div>
	</div>
);

const UploadScene: React.FC<{progress: number}> = ({progress}) => {
	return (
		<BrowserFrame title="Data Import Wizard">
			<div style={{display: 'flex', gap: 18, marginBottom: 18}}>
				<MetricCard label="Course" value="EECS280 Intro to Data Structures" />
				<MetricCard label="Exam" value="Midterm 1" />
			</div>

			<div
				style={{
					backgroundColor: colors.card,
					borderRadius: 16,
					padding: 22,
					border: '1px solid rgba(255,255,255,0.15)',
				}}
			>
				<div style={{fontSize: 30, color: colors.text, fontWeight: 700}}>Upload Scores</div>
				<div style={{fontSize: 18, color: colors.muted, marginTop: 8}}>
					CSV detected and validated. Student IDs extracted.
				</div>
				<div
					style={{
						marginTop: 18,
						backgroundColor: '#0b2345',
						borderRadius: 10,
						padding: 14,
						fontFamily: 'Menlo, monospace',
						color: '#d8e4fb',
						fontSize: 17,
						lineHeight: 1.5,
						whiteSpace: 'pre-wrap',
					}}
				>
					{`student_id,q1,q2,q3,q4,q5\nS-1001,1,0,1,1,0\nS-1002,0,0,1,0,0\nS-1003,1,1,1,1,1\nS-1004,1,0,0,1,0`}
				</div>

				<div style={{marginTop: 18, display: 'flex', gap: 16}}>
					<MetricCard label="Rows" value="2,316" />
					<MetricCard label="Students Detected" value="188" />
					<MetricCard label="Validation Errors" value="0" tone="ok" />
				</div>
			</div>

			<div style={{marginTop: 16}}>
				<div style={{fontSize: 16, color: colors.muted, marginBottom: 8}}>Pipeline progress</div>
				<div
					style={{
						height: 16,
						backgroundColor: '#0d2b57',
						borderRadius: 999,
						overflow: 'hidden',
					}}
				>
					<div
						style={{
							height: '100%',
							width: `${Math.round(progress * 100)}%`,
							background: 'linear-gradient(90deg, #4ea5ff 0%, #60d394 100%)',
						}}
					/>
				</div>
			</div>
		</BrowserFrame>
	);
};

const DashboardScene: React.FC = () => (
	<BrowserFrame title="Instructor Dashboard">
		<div style={{display: 'flex', gap: 14, marginBottom: 14}}>
			<MetricCard label="Students Processed" value="188" />
			<MetricCard label="Concepts Modeled" value="37" />
			<MetricCard label="At-Risk Concepts" value="8" />
		</div>
		<div style={{display: 'flex', gap: 16}}>
			<div
				style={{
					flex: 1.2,
					backgroundColor: colors.card,
					borderRadius: 16,
					padding: 20,
					border: '1px solid rgba(255,255,255,0.14)',
				}}
			>
				<div style={{fontSize: 28, color: colors.text, fontWeight: 700}}>Concept Readiness Heatmap</div>
				<div
					style={{
						marginTop: 14,
						display: 'grid',
						gridTemplateColumns: 'repeat(8, 1fr)',
						gap: 8,
					}}
				>
					{new Array(56).fill(true).map((_, idx) => {
						const value = (idx * 17) % 100;
						const color =
							value < 30 ? '#e63946' : value < 50 ? '#f4a261' : value < 70 ? '#e9c46a' : '#2a9d8f';
						return <div key={idx} style={{height: 24, borderRadius: 6, backgroundColor: color}} />;
					})}
				</div>
			</div>
			<div
				style={{
					flex: 1,
					backgroundColor: colors.card,
					borderRadius: 16,
					padding: 20,
					border: '1px solid rgba(255,255,255,0.14)',
				}}
			>
				<div style={{fontSize: 28, color: colors.text, fontWeight: 700}}>Root-Cause Alerts</div>
				<div style={{marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12}}>
					{[
						'Recursion drives 63% of downstream failures in Trees and Graphs',
						'Section B underperforms Section A by 18 points on Graphs',
						'43% of students below readiness threshold on Recursion',
						'Priority action: reteach base cases before next assessment',
					].map((line) => (
						<div
							key={line}
							style={{
								backgroundColor: '#0d2a53',
								borderRadius: 10,
								padding: 12,
								color: '#e8f0ff',
								fontSize: 19,
							}}
						>
							{line}
						</div>
					))}
				</div>
			</div>
		</div>
	</BrowserFrame>
);

const StudentScene: React.FC = () => (
	<BrowserFrame title="Student Intervention Report">
		<div style={{display: 'flex', gap: 16}}>
			<div
				style={{
					flex: 0.95,
					backgroundColor: colors.card,
					borderRadius: 16,
					padding: 20,
					border: '1px solid rgba(255,255,255,0.14)',
				}}
			>
				<div style={{fontSize: 28, color: colors.text, fontWeight: 700}}>Student: S-1002</div>
				<div style={{marginTop: 14, color: colors.muted, fontSize: 20}}>Risk Level: Elevated</div>
				<div style={{marginTop: 8, color: colors.muted, fontSize: 20}}>Primary Gap: Recursion base cases</div>
				<div style={{marginTop: 8, color: colors.muted, fontSize: 20}}>
					Secondary Impact: Trees and Graph traversal
				</div>
				<div
					style={{
						marginTop: 18,
						padding: 16,
						borderRadius: 12,
						backgroundColor: '#0d2a53',
						color: '#e4edff',
						fontSize: 18,
						lineHeight: 1.5,
					}}
				>
					The model traces low Trees readiness to prerequisite recursion weakness rather than tree-specific
					content exposure.
				</div>
			</div>
			<div
				style={{
					flex: 1.05,
					backgroundColor: colors.card,
					borderRadius: 16,
					padding: 20,
					border: '1px solid rgba(255,255,255,0.14)',
				}}
			>
				<div style={{fontSize: 28, color: colors.text, fontWeight: 700}}>Recommended Study Plan</div>
				<div style={{marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12}}>
					{[
						'Review recursion base-case pattern library (15 min)',
						'Complete dependency bridge: Recursion -> Trees (20 min)',
						'Attempt focused quiz and compare before/after readiness (10 min)',
						'Schedule TA checkpoint if readiness remains below 0.60',
					].map((item, idx) => (
						<div
							key={item}
							style={{
								padding: 12,
								backgroundColor: '#0d2a53',
								borderRadius: 10,
								color: '#e8f0ff',
								fontSize: 20,
							}}
						>
							{idx + 1}. {item}
						</div>
					))}
				</div>
			</div>
		</div>
	</BrowserFrame>
);

export const ProfessorWebsiteTrailer: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const heroEnter = spring({frame, fps, config: {damping: 200}, durationInFrames: 26});
	const heroOpacity = interpolate(heroEnter, [0, 1], [0, 1]);
	const heroY = interpolate(heroEnter, [0, 1], [40, 0]);

	const uploadProgress = interpolate(frame, [220, 490], [0.1, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const screenPop = spring({
		frame: frame - 200,
		fps,
		config: {damping: 220},
		durationInFrames: 24,
	});
	const screenScale = interpolate(screenPop, [0, 1], [0.94, 1]);

	return (
		<AbsoluteFill style={{backgroundColor: colors.bg, fontFamily: 'Inter, Arial, sans-serif'}}>
			<Sequence from={0} durationInFrames={230}>
				<AbsoluteFill
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						padding: 80,
						opacity: heroOpacity,
						transform: `translateY(${heroY}px)`,
					}}
				>
					<div style={badgeStyle}>INTRODUCING PREREQ</div>
					<div
						style={{
							marginTop: 24,
							fontSize: 88,
							fontWeight: 800,
							color: colors.text,
							textAlign: 'center',
							lineHeight: 1.06,
							maxWidth: 1520,
						}}
					>
						The assessment intelligence layer for modern professors
					</div>
					<div style={{marginTop: 24, fontSize: 36, color: colors.muted, textAlign: 'center', maxWidth: 1400}}>
						Upload scores, trace root causes, and deploy targeted interventions in minutes.
					</div>
				</AbsoluteFill>
			</Sequence>

			<Sequence from={200} durationInFrames={360}>
				<AbsoluteFill
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						transform: `scale(${screenScale})`,
					}}
				>
					<UploadScene progress={uploadProgress} />
				</AbsoluteFill>
			</Sequence>

			<Sequence from={560} durationInFrames={350}>
				<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
					<DashboardScene />
				</AbsoluteFill>
			</Sequence>

			<Sequence from={910} durationInFrames={260}>
				<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
					<StudentScene />
				</AbsoluteFill>
			</Sequence>

			<Sequence from={1130} durationInFrames={130}>
				<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
					<div style={badgeStyle}>READY FOR PILOT</div>
					<div
						style={{
							fontSize: 76,
							fontWeight: 800,
							color: colors.text,
							marginTop: 18,
							textAlign: 'center',
						}}
					>
						From exam scores to action plans.
					</div>
					<div style={{fontSize: 34, color: colors.muted, marginTop: 14}}>
						Designed for instructors, built for student outcomes.
					</div>
				</AbsoluteFill>
			</Sequence>

			<Sequence from={200} durationInFrames={960}>
				<AbsoluteFill
					style={{
						justifyContent: 'flex-end',
						alignItems: 'center',
						paddingBottom: 38,
					}}
				>
					<div
						style={{
							fontSize: 22,
							letterSpacing: 1.2,
							color: colors.accent,
							backgroundColor: 'rgba(255,203,5,0.09)',
							border: `1px solid ${colors.accent}`,
							padding: '10px 16px',
							borderRadius: 999,
						}}
					>
						REAL PROFESSOR FLOW: Import -&gt; Compute -&gt; Diagnose -&gt; Personalize
					</div>
				</AbsoluteFill>
			</Sequence>
		</AbsoluteFill>
	);
};
