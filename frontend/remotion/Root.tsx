import {Composition} from 'remotion';
import {
	ProfessorProcessDemo,
	type ProfessorProcessDemoProps,
} from './ProfessorProcessDemo';
import {ProfessorWebsiteTrailer} from './ProfessorWebsiteTrailer';

const sampleProps: ProfessorProcessDemoProps = {
	course: 'CS-201 Data Structures',
	exam: 'Midterm 1',
	scoresCsvPreview: [
		'student_id,q1,q2,q3,q4,q5',
		'S-1001,1,0,1,1,0',
		'S-1002,0,0,1,0,0',
		'S-1003,1,1,1,1,1',
		'S-1004,1,0,0,1,0',
	],
	mappingCsvPreview: [
		'question_id,concept,prerequisite',
		'q1,Arrays,',
		'q2,Recursion,Arrays',
		'q3,Trees,Recursion',
		'q4,Graphs,Trees',
		'q5,Dynamic Programming,Recursion',
	],
	alerts: [
		'43% of class is below readiness threshold on Recursion',
		'Primary bottleneck for Trees performance is Recursion mastery',
		'Section B underperforms Section A by 18 points on Graphs',
	],
	studyPlan: [
		'Review recursion base-case patterns (15 min)',
		'Complete tree traversal prerequisite set (20 min)',
		'Take targeted quiz: Recursion -> Trees bridge (10 min)',
	],
};

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="ProfessorProcessDemo"
				component={ProfessorProcessDemo}
				durationInFrames={1500}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={sampleProps}
			/>
			<Composition
				id="ProfessorWebsiteTrailer"
				component={ProfessorWebsiteTrailer}
				durationInFrames={1260}
				fps={30}
				width={1920}
				height={1080}
			/>
		</>
	);
};
