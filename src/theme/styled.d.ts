import "styled-components";
import { ThemedCssFunction } from "styled-components";
import { StringLiteralLike } from "typescript";

export interface colors_S {
	white: string;
	black: string;

	bg0: string;
	bg1: string;
	bg2: string;
	bg3: string;
	bg4: string;
	bg5: string;

	text1: string;
	text2: string;
	text3: string;

	primary1: string;
	primary2: string;

	border1: string;
	border2: string;

	linkInternal: string;
	linkExternal: string;

	lineChartColors: Array<string>;
}

// Extend the default theme to include my custom fields
declare module "styled-components" {
	export interface DefaultTheme {
		color: Colors_S;

		border: {
			thickness: string;
		};

		radius: {
			xs: string;
			sm: string;
			md: string;
			lg: string;
		};

		mediaWidth: {
			extraSmall: ThemedCssFunction<DefaultTheme>;
			small: ThemedCssFunction<DefaultTheme>;
			large: ThemedCssFunction<DefaultTheme>;
		};

		spacing: {
			none: string;
			xxs: string;
			xs: string;
			sm: string;
			md: string;
			lg: string;
			xl: string;
			xxl: string;
		};

		shadow: {
			none: string;
			card: string;
		};
	}
}
