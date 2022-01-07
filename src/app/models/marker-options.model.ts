import {LatLngCoordinates} from './lat-lng.model';

export interface MarkerOptions{
	position: LatLngCoordinates;
	map: any;
	title?: string;
	icon?:any;
	label?: any;
}