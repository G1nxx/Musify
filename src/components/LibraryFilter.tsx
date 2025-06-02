import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { colors } from '@/constants/tokens'

type LibraryFilterProps = {
	activeFilter: string
	onFilterChange: (filter: string) => void
	filters: string[]
}

const LibraryFilter = ({ activeFilter, onFilterChange, filters }: LibraryFilterProps) => {
	return (
		<View style={styles.filterContainer}>
			{filters.map((filter) => (
				<TouchableOpacity
					key={filter}
					onPress={() => onFilterChange(filter)}
					style={[styles.filterButton, activeFilter === filter && styles.activeFilter]}
				>
					<Text style={[styles.filterText, activeFilter === filter && styles.activeFilterText]}>
						{filter}
					</Text>
				</TouchableOpacity>
			))}
		</View>
	)
}

const styles = StyleSheet.create({
	filterContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		paddingHorizontal: 16,
		paddingVertical: 8,
		backgroundColor: 'transparent',
		marginBottom: 16,
	},
	filterButton: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
	activeFilter: {
		backgroundColor: colors.primary,
	},
	filterText: {
		color: '#b3b3b3',
		fontSize: 14,
		fontWeight: '600',
		textTransform: 'uppercase',
		letterSpacing: 0.5,
	},
	activeFilterText: {
		color: '#ffffff',
	},
})

export default LibraryFilter
