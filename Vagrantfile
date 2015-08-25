# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|

  config.vm.box = "ubuntu/trusty64"

  config.vm.provider :virtualbox do |vb|
    vb.gui = true
    vb.customize ["modifyvm", :id, "--hwvirtex", "on"]
  end

  config.vm.provision "docker" do |d|
    d.build_image "/vagrant"
  end

end
