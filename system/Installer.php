<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora;

use Composer\Script\Event;

/**
 * @license https://www.gnu.org/licenses/agpl-3.0.html AGPL-3.0
 * @license https://afterlogic.com/products/common-licensing Afterlogic Software License
 * @copyright Copyright (c) 2019, Afterlogic Corp.
 */
class Installer
{
	/**
	* NOTE! This method should be run from composer.
	*/
	public static function checkConfigs()
	{
		$RED = "\033[1;31m";
		$YELLOW = "\033[1;33m";
		$GREEN = "\033[1;32m";
		$NC = "\033[0m";
		
		$sBaseDir = dirname(dirname(__File__));
		$sModulesDir = $sBaseDir."/modules/";
		$aModuleDirs = glob($sModulesDir . '*' , GLOB_ONLYDIR);

		$aModulesOk = [];
		$aModulesHasError = [];
		$aModulesNoConfig = [];

		foreach ($aModuleDirs as $sModuleDir) {
			$sModuleName = str_replace($sModulesDir, "", $sModuleDir);
			
			$sConfigFile = $sModuleDir."/config.json";
			if (file_exists($sConfigFile)) {
				if (json_decode(file_get_contents($sConfigFile))) {
					$aModulesOk[] = $sModuleName;
				} else {
					$aModulesHasError[] = $sModuleName;
				}
			} else {
				$aModulesNoConfig[] = $sModuleName;
			}
		}

		echo $GREEN.count($aModuleDirs)." modules were processed".$NC."\r\n\r\n";

		if (count($aModulesHasError) > 0) {
			echo $YELLOW."The following modules have syntax problems in the config file (".count($aModulesHasError)."):".$NC."\r\n";
			echo $RED.implode("\r\n", $aModulesHasError).$NC;
			echo "\r\n\r\n";
		}

		if (count($aModulesNoConfig) > 0) {
			echo $YELLOW."The following modules have no config files (".count($aModulesNoConfig)."):".$NC."\r\n";
			echo $RED.implode("\r\n", $aModulesNoConfig).$NC;
			echo "\r\n\r\n";
		}

		if (count($aModulesOk) > 0) {
			echo $GREEN.count($aModulesOk)." modules have no problem with config files".$NC;
			echo "\r\n";
		}
	}
	
	/**
	* NOTE! This method should be run from composer.
	*/
    public static function updateConfigs()
	{
		$sBaseDir = dirname(__File__);
		$sMessage = "Configuration was updated successfully";

		include_once $sBaseDir . '/autoload.php';

		\Aurora\System\Api::Init();

		\Aurora\System\Api::GetModuleManager()->SyncModulesConfigs();

		// $aModules = \Aurora\System\Api::GetModules();

		// if (is_array($aModules))
		// {
			// foreach ($aModules as $oModule)
			// {
				// $oModule->saveModuleConfig();
			// }
		// }

		echo $sMessage."\r\n";
	}

	/**
	* NOTE! This method should be run from composer.
	*/
    public static function preConfigForce(Event $event)
	{
		self::preConfig($event);
	}

	/**
	* NOTE! This method should be run from composer.
	*/
    public static function preConfigSafe(Event $event)
	{
		$sBaseDir = dirname(__File__);

		//Checking that configuration files already exist
		if (count(glob(dirname($sBaseDir)."/data/settings/modules/*")) !== 0)
		{
			echo "The config files are already exist \r\n";
			return;
		}
		else
		{
			self::preConfig($event);
		}
	}
	
	/**
	* NOTE! This method should be run from composer.
	*/
    private static function preConfig(Event $event)
    {
		$sConfigFilename = 'pre-config.json';
		$sBaseDir = dirname(__File__);
		$sMessage = "Configuration was updated successfully";

	    $oExtra = $event->getComposer()->getPackage()->getExtra();

		if ($oExtra && isset($oExtra['aurora-installer-pre-config']))
		{
			$sConfigFilename = $oExtra['aurora-installer-pre-config'];
		}

		$sConfigPath = dirname($sBaseDir) . '/' . $sConfigFilename;

		if (file_exists($sConfigPath))
		{
			$sPreConfig = file_get_contents($sConfigPath);

			$oPreConfig = json_decode($sPreConfig, true);

			if ($oPreConfig)
			{
				include_once $sBaseDir . '/autoload.php';

				\Aurora\System\Api::Init();

				if ($oPreConfig['modules'])
				{
					$oModuleManager = \Aurora\System\Api::GetModuleManager();

					foreach ($oPreConfig['modules'] as $sModuleName => $oModuleConfig)
					{
						foreach ($oModuleConfig as $sConfigName => $mConfigValue)
						{
							$mValue = $oModuleManager->getModuleConfigValue($sModuleName, $sConfigName, null);

							if ($mValue !== null)
							{
								$oModuleManager->setModuleConfigValue($sModuleName, $sConfigName, $mConfigValue);
								$oModuleManager->saveModuleConfigValue($sModuleName);
							}
							else
							{
								echo "\r\nInvalid setting '" . $sConfigName . "' in module '" . $sModuleName . "'";
							}
						}
					}
				}
				if ($oPreConfig['system'])
				{
					$oSettings =&\Aurora\System\Api::GetSettings();
					foreach ($oPreConfig['system'] as $mKey => $mSett)
					{
						$oSettings->{$mKey} = $mSett;
					}
					$oSettings->Save();
				}
			}
			else
			{
				$sMessage = "Invalid config file";
			}
		}
		else
		{
			$sMessage = "Config file didn't found";
		}

		echo $sMessage."\r\n";
    }
}
