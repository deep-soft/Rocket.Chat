import type { IRole } from '@rocket.chat/core-typings';
import { useBreakpoints } from '@rocket.chat/fuselage-hooks';
import type { OptionProp } from '@rocket.chat/ui-client';
import { MultiSelectCustom } from '@rocket.chat/ui-client';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import FilterByText from '../../../../components/FilterByText';
import type { UsersFilters } from '../AdminUsersPage';

type UsersTableFiltersProps = {
	setUsersFilters: React.Dispatch<React.SetStateAction<UsersFilters>>;
	roleData: { roles: IRole[] } | undefined;
};

const UsersTableFilters = ({ roleData, setUsersFilters }: UsersTableFiltersProps) => {
	const { t } = useTranslation();

	const [selectedRoles, setSelectedRoles] = useState<OptionProp[]>([]);
	const [text, setText] = useState('');

	const handleSearchTextChange = useCallback(
		(text) => {
			setUsersFilters({ text, roles: selectedRoles });
			setText(text);
		},
		[selectedRoles, setUsersFilters],
	);

	const handleRolesChange = useCallback(
		(roles: OptionProp[]) => {
			setUsersFilters({ text, roles });
			setSelectedRoles(roles);
		},
		[setUsersFilters, text],
	);

	const userRolesFilterStructure = useMemo(
		() => [
			{
				id: 'filter_by_role',
				text: 'Filter_by_role',
			},
			{
				id: 'all',
				text: 'All_roles',
				checked: false,
			},
			...(roleData
				? roleData.roles.map((role) => ({
						id: role._id,
						text: role.description || role.name || role._id,
						checked: false,
				  }))
				: []),
		],
		[roleData],
	);

	const breakpoints = useBreakpoints();
	const fixFiltersSize = breakpoints.includes('lg') ? { maxWidth: 'x224', minWidth: 'x224' } : null;

	return (
		<FilterByText shouldAutoFocus placeholder={t('Search_Users')} onChange={handleSearchTextChange}>
			<MultiSelectCustom
				dropdownOptions={userRolesFilterStructure}
				defaultTitle='All_roles'
				selectedOptionsTitle='Roles'
				setSelectedOptions={handleRolesChange}
				selectedOptions={selectedRoles}
				searchBarText='Search_roles'
				{...fixFiltersSize}
			/>
		</FilterByText>
	);
};

export default UsersTableFilters;
