<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\CalendarMeetingsPlugin\Enums;

/**
 * @license https://www.gnu.org/licenses/agpl-3.0.html AGPL-3.0
 * @license https://afterlogic.com/products/common-licensing Afterlogic Software License
 * @copyright Copyright (c) 2021, Afterlogic Corp.
 */
class ErrorCodes
{
	const CannotSendAppointmentMessage = 1001;
	const CannotSendAppointmentMessageNoOrganizer = 1002;

	/**
	 * @var array
	 */
	protected $aConsts = [
		'CannotSendAppointmentMessage' => self::CannotSendAppointmentMessage,
		'CannotSendAppointmentMessageNoOrganizer' => self::CannotSendAppointmentMessageNoOrganizer
	];
}
